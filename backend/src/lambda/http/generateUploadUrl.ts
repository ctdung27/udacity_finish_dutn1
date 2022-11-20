import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { v4 as uuidv4 } from 'uuid';
import { cors, httpErrorHandler } from 'middy/middlewares'
import { AttachmentUtils } from '../../dataLayer/attachmentUtils'
import { getUserId } from '../utils'
import { updateAttachmentUrl } from '../../businessLogic/todos'

const attachmentUtils = new AttachmentUtils()

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('uploadUrl: ')
    const todoId = event.pathParameters.todoId
    const userId = getUserId(event)
    // ##TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    const attachmentId = uuidv4()

    let uploadUrl = await attachmentUtils.getUploadUrl(attachmentId);

    const attachmentUrl = await attachmentUtils.getAttachmentUrl(attachmentId)

    await updateAttachmentUrl(todoId, userId, attachmentUrl)

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        uploadUrl
      })
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )