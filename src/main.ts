// Import configs
require("dotenv").config();

import * as TypeORM from "typeorm";

// Temporary configs
const botToken = process.env.BOT_TOKEN || "";
const appURI = process.env.APP_URL || "";
const port = process.env.PORT || 8080;
const webhookPath = process.env.WEBHOOK_PATH;
const adminID = process.env.ADMIN_ID;

// Import koa
import * as path from "path";
import * as Koa from "koa";
import * as mkdirp from "mkdirp";
import * as cors from "@koa/cors";
import * as Router from "koa-router";

import {Telegraf} from "telegraf";

import {AppDataSource} from "./data-source"
import { Contact } from "./entity/Contact";

async function run() {
    try {
        await AppDataSource.initialize()
    } catch (e) {
        console.log("Failed to initialize")
    }
        
    
    let bot = new Telegraf(botToken);
    
    
    
    
    bot.start(async (ctx) => {
        if (ctx.chat.type == "private") {
            let user = ctx.chat;
            const contactRepository = AppDataSource.getRepository(Contact)
            
            let contact: Contact;
            let existing = await contactRepository.findOne({where: {
                telegramId:  user.id.toString()
            }})
            if (existing){
                contact = existing;
            }else {
                contact = new Contact();
            }
            
            
            contact.firstName = user.first_name
            contact.lastName = user.last_name
            contact.telegramId = user.id.toString()
            contact.username = user.username
            let member  = await ctx.getChatMember(user.id);
            if (member) {
                contact.language_code = member.user.language_code
                contact.is_bot = member.user.is_bot
            }
            
            await AppDataSource.manager.save(contact)
        }
        ctx.reply('Welcome')
    });

    bot.help((ctx) => {
        ctx.reply('Промо бот от Spacecode\n /subscribe - подписаться на рассылку\n /unsubscribe - отписаться от рассылки')
    });

    bot.command('subscribe', async (ctx) => {
        if (ctx.chat.type == "private") {
            let user = ctx.chat;
            const contactRepository = AppDataSource.getRepository(Contact)
            
            let contact: Contact;
            let existing = await contactRepository.findOne({where: {
                telegramId:  user.id.toString()
            }})
            if (existing){
                contact = existing;
            }else {
                contact = new Contact();
            }
            
            
            contact.firstName = user.first_name
            contact.lastName = user.last_name
            contact.telegramId = user.id.toString()
            contact.username = user.username
            let member  = await ctx.getChatMember(user.id);
            if (member) {
                contact.language_code = member.user.language_code
                contact.is_bot = member.user.is_bot
            }
            ctx.reply('Привет')
            
            await AppDataSource.manager.save(contact)
        }
        
    })

    bot.command('unsubscribe', async (ctx) => {
        if (ctx.chat.type == "private") {
            let user = ctx.chat;
            const contactRepository = AppDataSource.getRepository(Contact)
            
           
            let existing = await contactRepository.findOne({where: {
                telegramId:  user.id.toString()
            }})
            if (existing){
                contactRepository.delete(existing)
                ctx.reply('Мы успешно удалили ваш номер из нашего списка контактов')
            } else {
                ctx.reply('Подписка не активна')
            }
        }
        
    })

    bot.launch()

    // Enable graceful stop
    process.once('SIGINT', () => bot.stop('SIGINT'))
    process.once('SIGTERM', () => bot.stop('SIGTERM'))

}

run()