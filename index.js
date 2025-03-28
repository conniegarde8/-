// public/extensions/third-party/my-input-injector/index.js

// 通常不需要导入，除非你要用 renderExtensionTemplateAsync 或其他 API
// import { renderExtensionTemplateAsync } from '../../../extensions.js';

const pluginFolderName = 'my-input-injector'; // 确保与你的文件夹名一致！

// 使用 jQuery(async () => { ... }) 确保 DOM 加载完成后执行
jQuery(async () => {
    console.log(`加载插件: ${pluginFolderName}`);

    // --- 注入按钮到输入区域 ---
    try {
        // 1. 定位目标：发送按钮 (#send_but)
        const sendButton = $('#send_but');
        // 定位其父容器 (#rightSendForm)，虽然这里用不上，但有助于理解结构
        // const rightSendForm = $('#rightSendForm');

        // 检查发送按钮是否存在
        if (sendButton.length > 0) {

            // 2. 创建你的按钮 HTML (可以直接用字符串)
            //    - 给按钮一个唯一的 ID，例如 'my_injected_send_area_button'
            //    - 添加 'interactable' 类使其样式和行为与其他按钮类似
            //    - 添加 Font Awesome 图标 (可选，修改 fa-rocket 为你想要的图标)
            //    - 添加 title 属性作为鼠标悬停提示
            const myButtonHtml = `
                <div id="my_injected_send_area_button" class="fa-solid fa-rocket interactable" title="我的自定义操作" style="cursor: pointer; margin-right: 8px;"></div>
            `;
            // 注意：我添加了 margin-right 来给它和发送按钮之间留点空隙

            // --- 备选方案：如果按钮结构复杂，使用 HTML 模板 ---
            // a. 创建 public/extensions/third-party/my-input-injector/my_button.html
            // b. 在 index.js 顶部 import { renderExtensionTemplateAsync } from '../../../extensions.js';
            // c. 使用 renderExtensionTemplateAsync 加载:
            // const myButtonHtml = await renderExtensionTemplateAsync(`third-party/${pluginFolderName}`, 'my_button');

            // 3. 插入按钮：在发送按钮 (#send_but) 的前面插入新按钮
            sendButton.before(myButtonHtml);

            // 4. 为你的按钮绑定点击事件
            $('#my_injected_send_area_button').on('click', function() {
                // 'this' 指向被点击的按钮
                console.log('自定义注入按钮被点击了！');
                // 在这里执行你的按钮逻辑
                const text = $('#send_textarea').val(); // 获取输入框内容示例
                alert('输入框内容是: ' + text);
                // 或者调用其他 SillyTavern 函数等
            });

            console.log(`插件 ${pluginFolderName}: 成功在发送按钮前注入自定义按钮。`);

        } else {
            console.warn(`插件 ${pluginFolderName}: 未找到发送按钮 (#send_but)，无法注入按钮。`);
        }

    } catch (error) {
        console.error(`插件 ${pluginFolderName}: 注入按钮时发生错误:`, error);
    }
    // --- 注入结束 ---
});
