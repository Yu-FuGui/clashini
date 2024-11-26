/**
 * @author YU
 * @name 菜单
 * @team YU
 * @version 1.0.4
 * @description 可自定义菜单内容和底部显示的菜单插件
 * @rule ^(菜单|\/help)$
 * @admin false
 * @public true
 * @priority 1000
 * @disable false
 * @classification ["工具"]
 */

/// <reference path="../../@types/Bncr.d.ts" />
const defaultConfig = {
    menuItems: [
        {
            category: '🎡京东活动🎡',
            items: [
                { command: '登录', description: '短信/扫码登录' },
                { command: '查询', description: '查询账户信息' },
                { command: '豆豆', description: '查询豆豆明细' }
            ]
        },
        {
            category: '👽其它命令👽',
            items: [
                { command: '城市天气', description: '例如：北京天气' },
                { command: '打赏', description: '打赏一下，维护不易' }
            ]
        }
    ],
    bottomContent: '请多多拉人，一起撸 ~\n㊗️🎊家人们发大财,心想事成,身体健康'
};

const jsonSchema = BncrCreateSchema.object({
    menuItems: BncrCreateSchema.array(
        BncrCreateSchema.object({
            category: BncrCreateSchema.string().setTitle('分类名称'),
            items: BncrCreateSchema.array(
                BncrCreateSchema.object({
                    command: BncrCreateSchema.string().setTitle('命令'),
                    description: BncrCreateSchema.string().setTitle('描述')
                })
            ).setTitle('菜单项')
        })
    ).setDefault(defaultConfig.menuItems),
    bottomContent: BncrCreateSchema.string().setDefault(defaultConfig.bottomContent)
});

const ConfigDB = new BncrPluginConfig(jsonSchema);

function generateMenu(menuItems, bottomContent) {
    let message = [
        '═════命令❀描述════'
    ];
    for (const category of menuItems) {
        message.push(category.category);
        for (const item of category.items) {
            message.push(`${item.command.padEnd(8)}║ ${item.description}`);
        }
        message.push('┄┅┄┅┄┅┄┅┄┅┄┅┄');
    }
    message = message.concat(bottomContent.split('\\n'));
    return message.join('\n');
}

module.exports = async s => {
    try {
        // 获取配置
        await ConfigDB.get();
        if (!Object.keys(ConfigDB.userConfig).length) {
            return await s.reply('请先配置菜单内容');
        }

        // 获取菜单内容
        const { menuItems, bottomContent } = ConfigDB.userConfig;
        const menuContent = generateMenu(menuItems, bottomContent);

        // 定义内联按钮
        const inlineKeyboard = [
            [
                { text: '京东', callback_data: 'menu_jd' },
                { text: '娱乐', callback_data: 'menu_fun' }
            ],
            [
                { text: '热点', callback_data: 'menu_hot' },
                { text: '实用', callback_data: 'menu_tool' }
            ],
            [
                { text: '更多功能', callback_data: 'menu_more' }
            ]
        ];

        // 发送消息
        await s.reply({
            type: 'text',
            msg: menuContent,
            options: {
                reply_markup: {
                    inline_keyboard: inlineKeyboard
                }
            }
        });

    } catch (error) {
        console.error('发送菜单失败:', error);
        await s.reply('抱歉，生成菜单时出现错误，请稍后再试。');
    }
};
