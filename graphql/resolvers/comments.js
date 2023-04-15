const { UserInputError } = require('apollo-server')

const Post = require('../../models/Post')
const checkAuth = require('../../util/checkAuth')


module.exports = {

  Mutation: {
    createComment: async (_, {postId, body}, context) => {
      try {
        const {username} = checkAuth(context)
        if (body.trim() === '') {
          throw new UserInputError('Empty Comment', {
            errors: {
              body: 'Comment body must not be empty'
            }
          })
        }
        const post = await Post.findById(postId)
        if (post) {
          post.comments.unshift({
            body,
            username,
            createdAt: new Date().toISOString(),
          })
          await post.save()
          return post
        } else {
          throw new UserInputError('Post not found')
        }
      } catch(err) {
        throw new Error(err)
      }
    },
    deleteComment: async (_, {postId, commentId}, context) => {
      try {
        const user = checkAuth(context)
        const post = await Post.findById(postId)
        if (!post) {
          throw new Error('Post not available')
        }
        const comment = post.comments.filter(comment => comment.id === commentId)[0]
        if(!comment) {
          throw new Error('Comment not found')
        }
        if(comment.username !== user.username) {
          throw new Error('Invalid action')
        }
        await Post.updateOne({ _id: postId }, { $pull: { comments: { _id: commentId }}});
        const updatedPost = Post.findOne({_id: postId})
        return updatedPost
      } catch(err) {
        throw new Error(err)
      }
    },
  }
}