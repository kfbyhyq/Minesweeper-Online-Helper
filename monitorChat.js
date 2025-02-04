document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('buttonMonitorChat');
    chrome.tabs.query({ active: true, currentWindow: true }, function (tab1) {
        if (tab1[0].url.includes('https://minesweeper.online/cn/chat') || tab1[0].url.includes('https://minesweeper.online/chat')) {
            button.style.backgroundColor = '#6bc1f3';   // 对应按钮变为蓝色，表示可用
            button.style.cursor = 'pointer'; // 鼠标指针样式
            button.addEventListener('click', function () {
                button.style.backgroundColor = '#ff9f18';   // 对应按钮变为橙色，表示运行中
                const tabId = tab1[0].id;
                chrome.scripting.executeScript({
                    target: { tabId },
                    function: function () {
                        try {
                            const chatPage = document.querySelector("#chat_messages");
                            var chatBox;
                            for (let boxes of chatPage.children) {
                                if (window.getComputedStyle(boxes).display === 'block') {
                                    chatBox = boxes;
                                    break;
                                }
                            }
                            // 配置观察选项:
                            const config = { attributes: true, childList: true, subtree: true };
                            // 创建一个观察器实例并传入回调函数
                            const callback = function(mutationsList, observer) {
                                latestMessage();
                            };
                            const observer = new MutationObserver(callback);
                            // 以上述配置开始观察目标节点
                            observer.observe(chatBox, config);
                        } catch (e) {
                            console.log(e);
                            window.alert('错误页面');
                        }

                        function latestMessage() {
                            const chatPage = document.querySelector("#chat_messages");
                            var chatBox;
                            for (let boxes of chatPage.children) {
                                if (window.getComputedStyle(boxes).display === 'block') {
                                    chatBox = boxes;
                                    break;
                                }
                            }
                            const messageItem = chatBox.querySelector("div:last-child > table > tbody > tr > td:nth-child(2) > span.chat-message-text");
                            if (messageItem) {
                                const message = messageItem.textContent;
                                if (message.includes('free') || message.includes('FREE') || message.includes('Free') || message.includes('免费') ||
                                (!message.includes('rading') && !message.includes('rade') && !message.includes('RADE') && !message.includes('RADING') &&
                                !message.includes('ell') && !message.includes('ELL') && !message.includes('ale') && !message.includes('ALE') && 
                                !message.includes('mc') && message.includes('L') && message.includes('+') &&
                                (message.includes('Win') || message.includes('Earn') || message.includes('Find') || 
                                message.includes('获得') || message.includes('完成') || message.includes('獲得')))) {
                                    playAudio(523.2, 0.5, 0.5); // 播放提示音
                                    console.log(message);
                                    const regex = /(Beginner|Intermediate|Expert|custom|Easy|Medium|Hard|Evil|row|flags|efficiency|minecoin|honour|gem|arena coins|arena|初级|中级|高级|自定义|简单|中等|困难|地狱|连胜|盲扫|效率|金币|功勋|宝石|竞技场币|竞技场|初級|中級|高級|自訂|簡單|中等|困難|地獄|連勝|無旗幟|效率|金幣|榮譽值|寶石|競技場硬幣|競技場)/g;
                                    const abbr = { 'Beginner':'beg', 'Intermediate':'int', 'Expert':'exp', 'custom':'cus', 
                                        'Easy':'easy', 'Medium':'med', 'Hard':'hard', 'Evil':'evil', 
                                        'row':'ws', 'flags':'nf', 'efficiency':'eff', 
                                        'minecoin':'mc', 'honour':'hp', 'gem':'gem', 'arena coins':'ac', 'arena':'arena', 
                                        '初级':'初级', '中级':'中级', '高级':'高级', '自定义':'自定义', 
                                        '简单':'简单', '中等':'中等', '困难':'困难', '地狱':'地狱', 
                                        '连胜':'连胜', '盲扫':'盲扫', '效率':'效率', 
                                        '金币':'金币', '功勋':'功勋', '宝石':'宝石', '竞技场币':'场币', '竞技场':'竞技场', 
                                        '初級':'初級', '中級':'中級', '高級':'高級', '自訂':'自訂', 
                                        '簡單':'簡單', '中等':'中等', '困難':'困難', '地獄':'地獄', 
                                        '連勝':'連勝', '無旗幟':'無旗', '效率':'效率', 
                                        '金幣':'金幣', '榮譽值':'榮譽', '寶石':'寶石', '競技場硬幣':'場幣', '競技場':'競技場'}
                                    const matchedStr = [...message.matchAll(regex)].map(match => match[0]);
                                    const typeArea = document.querySelector("#chat_send_message"); // 输入框所在元素
                                    var buttonArea = typeArea.querySelector("#buttonArea"); // 在输入框下方创建按钮集合
                                    if (!buttonArea) {
                                        buttonArea = document.createElement('div');
                                        buttonArea.id = 'buttonArea';
                                        typeArea.appendChild(buttonArea);
                                    }
                                    buttonArea.innerHTML = '';
                                    var clearBoxButton = document.createElement('button');
                                    clearBoxButton.textContent = '清空输入框';
                                    clearBoxButton.className = 'fastInputButton';
                                    buttonArea.appendChild(clearBoxButton);
                                    clearBoxButton.addEventListener('click', function() {
                                        const inputBox = document.querySelector("#chat_new_message");
                                        inputBox.value = '';
                                    });
                                    var typeButtonMe = document.createElement('button');
                                    typeButtonMe.textContent = 'me';
                                    typeButtonMe.className = 'fastInputButton';
                                    buttonArea.appendChild(typeButtonMe);
                                    fastInput(typeButtonMe);
                                    for (let i = 0; i < matchedStr.length; i++) {
                                        var typeButton = document.createElement('button');
                                        typeButton.textContent = abbr[matchedStr[i]];
                                        typeButton.className = 'fastInputButton';
                                        buttonArea.appendChild(typeButton);
                                        fastInput(typeButton);
                                    }
                                }
                            }
                        }

                        function fastInput(button) {
                            button.addEventListener('click', function() {
                                const inputBox = document.querySelector("#chat_new_message");
                                inputBox.value = inputBox.value + button.textContent + ' ';
                            });
                        }

                        function playAudio(frequency, volume, time) {
                            var audioCtx = new (window.AudioContext);
                            // 创建一个振荡器节点
                            var oscillator = audioCtx.createOscillator();
                             // 设置波形类型
                            oscillator.type = 'triangle';
                            // 设置振荡器的频率
                            oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
                            // 创建一个增益节点来控制音量
                            var gainNode = audioCtx.createGain();
                            // 将振荡器连接到增益节点，然后将增益节点连接到音频上下文的输出
                            oscillator.connect(gainNode);
                            gainNode.connect(audioCtx.destination);
                            // 设置音量并开始播放
                            gainNode.gain.setValueAtTime(volume, audioCtx.currentTime); // 音量范围0到1
                            oscillator.start(audioCtx.currentTime);
                            // 设置停止播放的时间
                            oscillator.stop(audioCtx.currentTime + time);
                        }
                    }
                });
            });
        } else {
            button.style.backgroundColor = '#9b9b9b';   // 对应按钮变为灰色，表示不可用
        }
    });
});
