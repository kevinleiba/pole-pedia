const rawContent = {
  "time": 1661464712461,
  "blocks": [
    {
      "id": "Jb_J01Sf0B",
      "type": "paragraph",
      "data": {
        "text": "<b>Batman</b>&nbsp;is a&nbsp;<a href=\"https://en.wikipedia.org/wiki/Superhero\">superhero</a> appearing in&nbsp;<a href=\"https://en.wikipedia.org/wiki/American_comic_book\">American comic books</a>&nbsp;published by&nbsp;<a href=\"https://en.wikipedia.org/wiki/DC_Comics\">DC Comics</a>. "
      }
    },
    {
      "id": "tu9ca_v6gn",
      "type": "paragraph",
      "data": {
        "text": "The character was created by artist&nbsp;<a href=\"https://en.wikipedia.org/wiki/Bob_Kane\">Bob Kane</a>&nbsp;and writer&nbsp;<a href=\"https://en.wikipedia.org/wiki/Bill_Finger\">Bill Finger</a>"
      }
    }
  ],
  "version": "2.24.3"
}

const content = JSON.stringify(rawContent)

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

const firstSection = {
  title: "FirstSection",
  order: 1
}

const rawSubSectionContent = {
  "time": 1661464791123,
  "blocks": [
    {
      "id": "3zLlHn-wxQ",
      "type": "paragraph",
      "data": {
        "text": "FirstSubSectionContent"
      }
    }
  ],
  "version": "2.24.3"
}

const firstSubSection = {
  title: "FirstSubSection",
  content: JSON.stringify(rawSubSectionContent),
  order: 0,
}

module.exports = {
  content,
  dbObject,
  order,
  title,
  firstSection,
  firstSubSection
}