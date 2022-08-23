const content = `
# Sample Section
this is a sample section with some sample text *inside* of **it**

# Sample Seconde Section
yet another section....
  `

const order = 0
const title = "Batman"



const dbObject = {
  "uuid": "81957122-1b02-4533-b094-08f5bccfb24f",
  "content": content,
  "order": order,
  "title": title,
  "articleUuid": "b682c8fe-429d-4917-999b-f308516e3f12",
  "createdAt": "2022-08-20T22:06:51.920Z",
  "updatedAt": "2022-08-20T22:06:51.921Z"
}

module.exports = {
  content,
  dbObject,
  order,
  title
}