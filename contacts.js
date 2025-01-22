document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.local.get(['contactsList'], function(result) {
        let contactsList = result.contactsList || {};
        var index = 0;
        if (Object.keys(contactsList).length > 0) {
            for (let uid in contactsList) {
                if (Array.isArray(contactsList[uid])) {
                    break;
                }
                contactsList[uid] = [contactsList[uid], index];
                index++;
            }
        }
        chrome.storage.local.set({ contactsList: contactsList });
    });
    displayContacts(); // 初始化显示
    /* 添加好友 */
    document.getElementById('addFriend').addEventListener('click', function() {
        document.getElementById('addFriendFlag').textContent = 0;
        document.getElementById('addFriendNotice').textContent = '';
        const uid = document.getElementById('addFriendUid').value;
        if (uid && !isNaN(uid)) {
            document.getElementById('addFriendNotice').textContent = '正在查找好友……';
            document.getElementById('addFriendUid').value = '';
            chrome.tabs.create({ url: ('https://minesweeper.online/cn/player/' + uid), active: false }, function (tab) {
                const ti = tab.id;
                var t0 = 100;
                var flag;
                var count = 1;
                var countMax = 300;
                intFriend = setInterval(() => {
                    flag = document.getElementById('addFriendFlag').textContent;
                    if (flag == 1) {
                        clearInterval(intFriend);
                        chrome.tabs.remove(ti, function() {});
                        document.getElementById('addFriendNotice').textContent = '添加好友成功！';
                    } else if (count == countMax) {
                        clearInterval(intFriend);
                        chrome.tabs.remove(ti, function() {});
                        document.getElementById('addFriendNotice').textContent = '添加好友失败！uid错误或网络异常';
                    } else {
                        extractName(ti, uid);
                        count++;
                    }
                }, t0);

                function extractName(tabId, uid) {
                    chrome.scripting.executeScript({
                        target: { tabId },
                        args: [uid],
                        function: function (uid) {
                            try {
                                const name = document.querySelector("#PlayerBlock > h2 > div.pull-left > span").textContent;
                                var friendInfo = [uid, name];
                                console.log(friendInfo);
                                chrome.runtime.sendMessage({ action: 'sendFriendInfo', friendInfo: friendInfo });
                            } catch (e) {
                                console.log(e);
                            }
                        }
                    });
                }
            });
        }
    });
    /* 管理好友 */
    document.getElementById('editFriend').addEventListener('click', function() {
        var editCells = document.getElementsByClassName('editFriendCell');
        for (let i = 0; i < editCells.length; i++) {
            // cells[i].style.visibility = 'visible';
            editCells[i].style.display = 'table-cell';
        }
        if (document.getElementById('sortFriendMethod').innerText != 0) {
            var rankCells = document.getElementsByClassName('changeRankCell');
            for (let i = 0; i < rankCells.length; i++) {
                rankCells[i].style.visibility = 'hidden';
            }
        }
        document.getElementById('editFriendOver').style.display = 'inline';
    });
    document.getElementById('editFriendOver').addEventListener('click', function() {
        var cells = document.getElementsByClassName('editFriendCell');
        for (let i = 0; i < cells.length; i++) {
            // cells[i].style.visibility = 'visible';
            cells[i].style.display = 'none';
        }
        document.getElementById('editFriendOver').style.display = 'none';
    });
    /* 排序 */
    let sortFriendMethod = document.getElementById('sortFriendMethod');
    let friendUidDesc = document.getElementById('friendUidDesc');
    let friendNameDesc = document.getElementById('friendNameDesc');
    document.getElementById('sortFriendDefalt').addEventListener('click', function() {
        sortFriendMethod.textContent = 0;
        setTimeout(() => {
            displayContacts();
        }, 10);
    });
    document.getElementById('sortFriendUid').addEventListener('click', function() {
        if (sortFriendMethod.textContent != 1) {
            sortFriendMethod.textContent = 1;
        } else if (friendUidDesc.textContent == 0) {
            friendUidDesc.textContent = 1;
        } else {
            friendUidDesc.textContent = 0;
        }
        setTimeout(() => {
            displayContacts();
        }, 10);
    });
    document.getElementById('sortFriendName').addEventListener('click', function() {
        if (sortFriendMethod.textContent != 2) {
            sortFriendMethod.textContent = 2;
        } else if (friendNameDesc.textContent == 0) {
            friendNameDesc.textContent = 1;
        } else {
            friendNameDesc.textContent = 0;
        }
        setTimeout(() => {
            displayContacts();
        }, 10);
    });
});

/* 显示好友列表主函数 */
function displayContacts() {
    document.getElementById('editFriendOver').style.display = 'none';
    chrome.storage.local.get(['contactsList'], function(result) {
        let contactsList = result.contactsList;
        if (Object.keys(contactsList).length > 0) {
            document.getElementById('noContacts').style.display = 'none';
            document.getElementById('contactsArea').style.display = 'block';
            console.log('好友列表：', contactsList);
            var contactsTable = document.getElementById('contactsTable');
            contactsTable.innerHTML = '';
            var uidRank = [];
            let sfm = document.getElementById('sortFriendMethod').innerText;
            let fud = document.getElementById('friendUidDesc').innerText;
            let fnd = document.getElementById('friendNameDesc').innerText;
            if (sfm == 0) { // 默认排序
                for (const uid in contactsList) {
                    uidRank[contactsList[uid][1]] = uid;
                }
            } else if (sfm == 1) {
                if (fud == 1) {
                    uidRank = Object.keys(contactsList).sort((a, b) => b - a);
                } else {
                    uidRank = Object.keys(contactsList).sort((a, b) => a - b);
                }
            } else if (sfm == 2) {
                var sortName;
                if (fnd == 1) {
                    sortName = Object.entries(contactsList).sort(([, a], [, b]) => b[0].localeCompare(a[0]));
                } else {
                    sortName = Object.entries(contactsList).sort(([, a], [, b]) => a[0].localeCompare(b[0]));
                }
                uidRank = sortName.map(([key]) => key);
            }
            for (let i = 0; i < uidRank.length; i++) {
                let uid = uidRank[i];
                var friendRow = contactsTable.insertRow();
                friendRow.id = 'friend' + uid;
                var name = friendRow.insertCell();
                name.textContent = contactsList[uid][0];
                var uidCell = friendRow.insertCell();
                uidCell.textContent = uid;

                var openPage = document.createElement('button');
                openPage.id = 'open' + uid;
                openPage.className  = 'openFriend';
                openPage.textContent = '个人主页';
                var exchange = document.createElement('button');
                exchange.id = 'exchange' + uid;
                exchange.className  = 'exchangeFriend';
                exchange.textContent = '一对一交易';
                var op = friendRow.insertCell();
                op.appendChild(openPage);
                var ex = friendRow.insertCell();
                ex.appendChild(exchange);

                var up = document.createElement('button');
                up.id = 'up' + uid;
                up.className  = 'changeRankButton';
                up.textContent = '▲';
                if (contactsList[uid][1] == 0) {
                    up.style.visibility = 'hidden';
                }
                var down = document.createElement('button');
                down.id = 'down' + uid;
                down.className  = 'changeRankButton';
                down.textContent = '▼';
                if (contactsList[uid][1] == uidRank.length - 1) {
                    down.style.visibility = 'hidden';
                }
                var cr = friendRow.insertCell();
                cr.classList = 'editFriendCell changeRankCell';
                // cr.style.visibility = 'hidden'
                cr.style.display = 'none';
                cr.appendChild(up);
                cr.appendChild(down);

                var deleteFriend = document.createElement('button');
                deleteFriend.id = 'deleteFriend' + uid;
                deleteFriend.className  = 'deleteFriend';
                deleteFriend.textContent = '删除好友';
                var df = friendRow.insertCell();
                df.className = 'editFriendCell';
                // df.style.visibility = 'hidden'
                df.style.display = 'none';
                df.appendChild(deleteFriend);

                contactsLinks(uid);
            }
        } else {
            document.getElementById('noContacts').style.display = 'block';
            document.getElementById('contactsArea').style.display = 'none';
        }
    });
}

function contactsLinks(uid) {
    const open = document.getElementById('open' + uid);
    const exchange = document.getElementById('exchange' + uid);
    const deleteFriend = document.getElementById('deleteFriend' + uid);
    const up = document.getElementById('up' + uid);
    const down = document.getElementById('down' + uid);
    open.addEventListener('click', function() {
        chrome.tabs.create({ url: ('https://minesweeper.online/cn/player/' + uid), active: true });
    });
    exchange.addEventListener('click', function() {
        chrome.tabs.create({ url: ('https://minesweeper.online/cn/exchange/new/' + uid), active: true });
    });
    deleteFriend.addEventListener('click', function() {
        chrome.storage.local.get(['contactsList'], function(result) {
            let contactsList = result.contactsList || {};
            var index = contactsList[uid][1];
            delete contactsList[uid];
            for (let uids in contactsList) {
                if (contactsList[uids][1] > index) {
                    contactsList[uids][1]--;
                }
            }
            chrome.storage.local.set({ contactsList: contactsList });
        });
        setTimeout(() => {
            document.getElementById('addFriendNotice').textContent = '';
            displayContacts();
        }, 10);
        setTimeout(() => {
            document.getElementById('editFriend').click();
        }, 20);
    });
    up.addEventListener('click', function() {
        chrome.storage.local.get(['contactsList'], function(result) {
            let contactsList = result.contactsList || {};
            var index = contactsList[uid][1];
            if (index > 0) {
                for (let id in contactsList) {
                    if (contactsList[id][1] == index - 1) {
                        contactsList[id][1]++;
                        contactsList[uid][1]--;
                        break;
                    }
                }
            }
            chrome.storage.local.set({ contactsList: contactsList });
        });
        setTimeout(() => {
            document.getElementById('addFriendNotice').textContent = '';
            displayContacts();
        }, 10);
        setTimeout(() => {
            document.getElementById('editFriend').click();
        }, 20);
    });
    down.addEventListener('click', function() {
        chrome.storage.local.get(['contactsList'], function(result) {
            let contactsList = result.contactsList || {};
            var index = contactsList[uid][1];
            if (index < Object.keys(contactsList).length - 1) {
                for (let id in contactsList) {
                    if (contactsList[id][1] == index + 1) {
                        contactsList[id][1]--;
                        contactsList[uid][1]++;
                        break;
                    }
                }
            }
            chrome.storage.local.set({ contactsList: contactsList });
        });
        setTimeout(() => {
            document.getElementById('addFriendNotice').textContent = '';
            displayContacts();
        }, 10);
        setTimeout(() => {
            document.getElementById('editFriend').click();
        }, 20);
    });
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'sendFriendInfo') {
        let friendInfo = request.friendInfo;
        console.log('收到好友信息：', friendInfo);
        chrome.storage.local.get(['contactsList'], function(result) {
            let contactsList = result.contactsList || {}; // 确保存在数据，防止为 undefined
            var index = Object.keys(contactsList).length;
            if (contactsList[friendInfo[0]]) {
                contactsList[friendInfo[0]][0] = friendInfo[1];
            } else {
                contactsList[friendInfo[0]] = [friendInfo[1], index];
            }
            // 保存更新后的数据
            chrome.storage.local.set({ contactsList: contactsList });
        });
        document.getElementById('addFriendFlag').textContent = 1;   // 设置成功标记
        setTimeout(() => {
            displayContacts();
        }, 100);
    }
});