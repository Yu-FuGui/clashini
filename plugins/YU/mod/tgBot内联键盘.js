/**
 * @author XY
 * @name tgBot内联键盘
 * @team XY
 * @version 1.0.5
 * @description tgBot内联键盘
 * @admin false
 * @module true
 * @public true
 * @disable false
 * @classification ["工具"]
 */


module.exports = async function handleCallbackQuery(data, callbackQuery, tgBot) {
    const { message, from } = callbackQuery;
    const chatId = message.chat.id;
    const messageId = message.message_id; // 当前消息的 ID

    // 发送新的菜单并删除当前消息
    async function sendAndDeleteNewMenu(newMenuText, newMenuOptions) {
        try {
            // 先删除当前的菜单消息
            await tgBot.deleteMessage(chatId, messageId);

            // 发送新的菜单消息
            const sentMessage = await tgBot.sendMessage(chatId, newMenuText, {
                reply_markup: {
                    inline_keyboard: newMenuOptions
                }
            });

            // 删除新菜单的消息（这部分根据需求来定）
            // 你可以选择是否再删除新菜单，或者让它永远保持显示
        } catch (err) {
            console.error('处理菜单时出错:', err);
        }
    }

    switch (data) {
        case 'menu_jd': // 点击京东菜单
            await sendAndDeleteNewMenu('═════京东════\n请选择操作：', [
                [{ text: '登录代挂', callback_data: '登录' }],
                [{ text: '查询资产', callback_data: '查询' }],
                [{ text: '返回主菜单', callback_data: 'menu_main' }]
            ]);
            break;

        case 'menu_fun': // 点击娱乐菜单
            await sendAndDeleteNewMenu('═══════娱乐═══════\n请选择操作：', [
                [{ text: '随机小姐姐', callback_data: 'xjj' }, { text: '穿搭', callback_data: '美女穿搭' }, { text: '身材', callback_data: '完美身材' }],
                [{ text: '玉足', callback_data: '玉足' }, { text: '古风', callback_data: '古风' }, { text: '萝莉', callback_data: '萝莉' }],
                [{ text: '舞蹈', callback_data: '热舞' }, { text: 'COS', callback_data: 'COS' }, { text: 'jk', callback_data: 'jk' }],
                [{ text: '返回主菜单', callback_data: 'menu_main' }]
            ]);
            break;

        case 'menu_hot': // 点击热点菜单
            await sendAndDeleteNewMenu('═════热点════\n请选择操作：', [
                [{ text: '知乎', callback_data: '知乎热搜' }, { text: '微博', callback_data: '微博热搜' }],
                [{ text: '抖音', callback_data: '抖音热搜' }, { text: '哔哩', callback_data: '哔哩热搜' }],
                [{ text: '返回主菜单', callback_data: 'menu_main' }]
            ]);
            break;

        case 'menu_tool': // 点击实用菜单
            await sendAndDeleteNewMenu('═════实用════\n请选择操作：', [
                [{ text: '四川油价', callback_data: '四川油价' }],
                [{ text: '成都天气', callback_data: '成都天气' }],
                [{ text: '返回主菜单', callback_data: 'menu_main' }]
            ]);
            break;

        case 'menu_more': // 点击更多功能
            await sendAndDeleteNewMenu('═════更多功能════\n请选择操作：', [
                [{ text: '插件更新', callback_data: '插件更新' }],
                [{ text: '更换白名单', callback_data: '更换白名单' }],
                [{ text: '返回主菜单', callback_data: 'menu_main' }]
            ]);
            break;

        case 'menu_main': // 返回主菜单
            try {
                // 删除当前消息（如果是从二级菜单返回）
                await tgBot.deleteMessage(chatId, messageId);

                // 发送主菜单
                await tgBot.sendMessage(chatId, '═════主菜单════\n请选择操作：', {
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '京东', callback_data: 'menu_jd' }, { text: '娱乐', callback_data: 'menu_fun' }],
                            [{ text: '热点', callback_data: 'menu_hot' }, { text: '实用', callback_data: 'menu_tool' }],
                            [{ text: '更多功能', callback_data: 'menu_more' }]
                        ]
                    }
                });
            } catch (err) {
                console.error('返回主菜单时出错:', err);
            }
            break;

        // 处理具体的子菜单操作（例如登录、查询等）
        case '查询':
        case '登录':
        case 'xjj':
        case '吊带':
        case '丝滑舞蹈':
        case '玉足':
        case '萝莉':
        case 'COS':
        case '美女穿搭':
        case '完美身材':
        case '古风':
        case 'jk':
        case '热舞':
        case '知乎热搜':
        case '微博热搜':
        case '抖音热搜':
        case '哔哩':
        case '四川油价':
        case '成都天气':
        case '插件更新':
        case '更换白名单':
            await tgBot.deleteMessage(chatId, messageId);
            tgBot.emit('message', {
                from: from,
                chat: message.chat,
                text: data
            });
            break;

        default:
            await tgBot.sendMessage(chatId, '未知操作！');
    }

    // 回应 callback_query，避免超时报错
    tgBot.answerCallbackQuery(callbackQuery.id, {
        text: `正在加载... "${data}" `,
        show_alert: false
    });
};
