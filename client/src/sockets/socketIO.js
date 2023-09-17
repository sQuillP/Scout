import {io} from 'socket.io-client'
import { URL } from '../axios/scout'


export const socket = io("http://localhost:3030");