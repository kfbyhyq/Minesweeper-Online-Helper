document.addEventListener('DOMContentLoaded', function() {
    var contactsList = {};
    // contactsList['25924676'] = '飞羽QAQ';
    // contactsList['7925244'] = 'SDXX';
    // chrome.storage.local.set({ contactsList: contactsList});
    displayContacts();
});

function displayContacts() {
    chrome.storage.local.get(['contactsList'], function(result) {
        let contactsList = result.contactsList;
        if (contactsList) {
            var contactsPage = document.getElementById('contacts');
            contactsPage.innerHTML = '';
            for (const uid in contactsList) {
                var friendItem = document.createElement('div'); // 创建用户条目
                friendItem.id = 'friend' + uid;
                friendItem.style.display = 'block'; // 独占一行
                var name = document.createElement('span'); // 姓名
                name.id = 'name' + uid;
                name.className  = 'plainText';
                name.textContent = contactsList[uid];
                var openPage = document.createElement('button');
                openPage.id = 'open' + uid;
                openPage.className  = 'openFriend';
                openPage.textContent = '个人主页';
                var exchange = document.createElement('button');
                exchange.id = 'exchange' + uid;
                exchange.className  = 'exchangeFriend';
                exchange.textContent = '一对一交易';
                var blank1 = document.createElement('span'); // 空格调整间距
                var blank2 = document.createElement('span');
                blank1.className = 'blank';
                blank2.className = 'blank';
                friendItem.appendChild(name); // 把元素加入本行
                friendItem.appendChild(blank1);
                friendItem.appendChild(openPage);
                friendItem.appendChild(blank2);
                friendItem.appendChild(exchange);
                contactsPage.appendChild(friendItem); // 把行加入页面
                var br = document.createElement('br');
                contactsPage.appendChild(br);
                contactsLink(uid);
            }
        } else {
            document.getElementById('noContacts').style.display = 'block';
        }
    });
}

function contactsLink(uid) {
    const open = document.getElementById('open' + uid);
    const exchange = document.getElementById('exchange' + uid);
    open.addEventListener('click', function() {
        chrome.tabs.create({ url: ('https://minesweeper.online/cn/player/' + uid), active: true });
    });
    exchange.addEventListener('click', function() {
        chrome.tabs.create({ url: ('https://minesweeper.online/cn/exchange/new/' + uid), active: true });
    });
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'sendFriendInfo') {
        let friendInfo = request.friendInfo;
        console.log('收到好友信息：', friendInfo);
        setTimeout(() => {
            displayContacts();
        }, 100);
    }
});