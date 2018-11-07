var Blog = require('../models/blog');
var Decerta = require('../models/dekerta');
var Articles = require('../models/articles');

module.exports = {
  blog: {
    model: Blog,
    listMiddleware: 'some',
    commonMiddleware: 'some'
  },
  athletes: {
    model: Decerta,
    listMiddleware: 'some',
    commonMiddleware: 'some'
  },
  articles: {
    model: Articles,
    listMiddleware: 'some',
    commonMiddleware: 'some'
  }
}
