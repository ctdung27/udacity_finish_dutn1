import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('TodosAccess')

// ##TODO: Implement the dataLayer logic
export class TodosAccess {

    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODOS_TABLE,
        private readonly todosIndex = process.env.INDEX_NAME
    ){}

    async getAllTodos(userId: string): Promise<TodoItem[]> {
        logger.info('Get all todos function called');

        const result = await this.docClient.query({
            TableName: this.todosTable,
            IndexName: this.todosIndex,
            KeyConditionExpression:'userId = :userId',
            ExpressionAttributeValues: {
                ':userId' : userId
            },
        }).promise();
          
        const items = result.Items
        return items as TodoItem[]
    }

    async createTodo(
        todo: TodoItem
    ): Promise<TodoItem> {
        logger.info('Call Update todo item func');
        await this.docClient.put({
            TableName: this.todosTable,
            Item: todo
        }).promise()

        return todo
    }

    async updateTodoItem(
        todoId: string, 
        userId: string, 
        todoUpdate: TodoUpdate): Promise<TodoUpdate> {
        logger.info('Call Update todo item func');

        const result = await this.docClient.update({
            TableName: this.todosTable,
            Key: {
                userId: userId,
                todoId: todoId
            },
            UpdateExpression: 'set #dynobase_name = :name, dueDate = :dueDate, description = :description, #dynobase_status = :status',
            ExpressionAttributeValues: {
                ':name': todoUpdate.name,
                ':dueDate': todoUpdate.dueDate,
                ':description': todoUpdate.description,
                ':status': todoUpdate.status,
            },
            ExpressionAttributeNames: { 
                "#dynobase_name": "name", 
                "#dynobase_status": "status" 
            },
        }).promise()

        logger.info('To do item updated')
        return result.Attributes as TodoUpdate
    }

    async updateAttachmentUrl(
        todoId: string, 
        userId: string,
        uploadUrl: string): Promise<string> {
        logger.info('call TodosAccess.updateTodo'+ uploadUrl);
        
        await this.docClient.update({
            TableName: this.todosTable,
            Key: {
                userId: userId,
                todoId: todoId
            },
            UpdateExpression: 'set attachmentUrl = :attachmentUrl',
            ExpressionAttributeValues: {
                ':attachmentUrl': uploadUrl.split("?")[0]
            }
        }).promise()

        logger.info('result: ' + uploadUrl);
        return uploadUrl
    }

    async deleteTodoItem(
        todoId: string,
        userId: string 
        ) {
            logger.info('Delete todo item func called');
            await this.docClient.delete({
                TableName: this.todosTable,
                Key: {
                    userId: userId,
                    todoId: todoId
                }
            }).promise()

            logger.info('result: done');
    }   
}
