document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('buttonAddFriend');
    chrome.tabs.query({ active: true, currentWindow: true }, function (tab1) {
        const url1 = tab1[0].url;
        if (url1.includes('https://minesweeper.online/') && url1.includes('player/')) {
            var uid = url1.match(/player\/(\d+)/)[1];
            button.style.backgroundColor = '#6bc1f3';   // 对应按钮变为蓝色，表示可用
            button.style.cursor = 'pointer'; // 鼠标指针样式
            button.addEventListener('click', function () {
                button.style.backgroundColor = '#ff9f18';   // 对应按钮变为橙色，表示运行中
                const tabId = tab1[0].id;
                chrome.scripting.executeScript({
                    target: { tabId },
                    args: [uid],
                    function: function (uid) {
                        const name = document.querySelector("#PlayerBlock > h2 > div.pull-left > span").textContent;
                        var friendInfo = [uid, name];
                        console.log(friendInfo);
                        chrome.runtime.sendMessage({ action: 'sendFriendInfo', friendInfo: friendInfo });
                    }
                });
            });
        } else {
            button.style.backgroundColor = '#9b9b9b';   // 对应按钮变为灰色，表示不可用
        }
    });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'sendFriendInfo') {
        let friendInfo = request.friendInfo;
        console.log('收到好友信息：', friendInfo);
        chrome.storage.local.get(['contactsList'], function(result) {
            const contactsList = result.contactsList || {}; // 确保存在数据，防止为 undefined
            contactsList[friendInfo[0]] = friendInfo[1];
        
            // 保存更新后的数据
            chrome.storage.local.set({ contactsList: contactsList });
        });

        document.getElementById('buttonAddFriend').style.backgroundColor = '#4caf50';
    }
});