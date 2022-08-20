import * as articleMock from '../../../mocks/article'
import * as sectionMock from '../../../mocks/section'

export function getAllArticles() {
  return vi.fn().mockResolvedValue([
    {
      ...articleMock.dbObject,
      "sections": [
        sectionMock.dbObject,
        {
          "uuid": "f538bed3-0f5c-4ee4-b828-e9d1ec046e9e",
          "content": "First section content that is very interesting",
          "order": 1,
          "title": "FirstSection",
          "articleUuid": "b682c8fe-429d-4917-999b-f308516e3f12",
          "createdAt": "2022-08-20T22:06:51.932Z",
          "updatedAt": "2022-08-20T22:06:51.933Z"
        }
      ]
    }
  ])
}