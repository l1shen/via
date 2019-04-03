import 'reflect-metadata'
import Koa from 'koa'
import { routingConfigs, useMongoDB } from './customs'
import { Container } from 'typedi'
import { useMiddlewares } from './middlewares'
import { useKoaServer, useContainer } from 'routing-controllers'

if (useMongoDB) {
  require('./connection')
}

export const createServer = async(): Promise<Koa> => {
  const koa: Koa = new Koa()
  
  const app: Koa = useKoaServer<Koa>(koa, routingConfigs)
  
  useContainer(Container)
  
  return useMiddlewares(app)
}
