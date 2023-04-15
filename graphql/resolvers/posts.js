const { AuthenticationError } = require('apollo-server')

const Post = require('../../models/Post')
const checkAuth = require('../../util/checkAuth')

module.exports = {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find().sort({createdAt: -1})
        return posts
      } catch (err) {
        throw new Error(err);
      }
    },
    async getPost(_, {postId}) {
      try {
        const post = await Post.findById(postId)
        if(post) {
          return post
        } else {
          throw new Error('Post not found')
        }
      } catch (err) {
        throw new Error(err)
      }
    }
  },
  Mutation: {
    async createPost(_, {body}, context) {
      try {
        const user = checkAuth(context)
        if (body.trim() == '') {
          throw new Error('Post body cannot be empty')
        }
        const newPost =  new Post({
          body,
          user: user.id,
          username: user.username,
          createdAt: new Date().toISOString()
        })
        const post = await newPost.save()
        return post
      } catch (err) {
        throw new Error(err)
      }
    },
    async deletePost(_, {postId}, context) {
      try {
        const user = checkAuth(context)
        const post = await Post.findById(postId)
        if (post.username === user.username) {
          post.deleteOne()
          return "Post deleted successfully"
        } else {
          throw new AuthenticationError("Action not allowed")
        }
      } catch (err) {
        throw new Error(err)
      }
    },
    likePost: async (_, {postId}, context) => {
      try {
        const {username} = checkAuth(context)
        const post = await Post.findById(postId)
        if(!post) {
          throw new Error('Post is not available')
        }

        if (post.likes.find(like => like.username === username)) {
          // Post already liked, unlike it
          post.likes = post.likes.filter(like => like.username !== username)
        } else {
          // Not liked, like the post
          post.likes.push({
            username,
            createdAt: new Date().toISOString()
          })
        }
        await post.save()
        return post
      } catch(err) {
        throw new Error(err)
      }
    }
  }
}