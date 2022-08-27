const content = `<p><strong>Batman</strong> is a <a target="_blank" rel="noopener noreferrer nofollow" href="https://en.wikipedia.org/wiki/Superhero">superhero</a> appearing in <a target="_blank" rel="noopener noreferrer nofollow" href="https://en.wikipedia.org/wiki/American_comic_book">American comic books</a> published by <a target="_blank" rel="noopener noreferrer nofollow" href="https://en.wikipedia.org/wiki/DC_Comics">DC Comics</a>.</p><p>The character was created by artist <a target="_blank" rel="noopener noreferrer nofollow" href="https://en.wikipedia.org/wiki/Bob_Kane">Bob Kane</a> and writer <a target="_blank" rel="noopener noreferrer nofollow" href="https://en.wikipedia.org/wiki/Bill_Finger">Bill Finger</a>, and debuted in <a target="_blank" rel="noopener noreferrer nofollow" href="https://en.wikipedia.org/wiki/Detective_Comics_27">the 27th issue</a> of the comic book <a target="_blank" rel="noopener noreferrer nofollow" href="https://en.wikipedia.org/wiki/Detective_Comics"><em>Detective Comics</em></a> on March 30, 1939.</p>`

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


const firstSubSection = {
  title: "FirstSubSection",
  content: `<p>FirstSubSectionContent</p>`,
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