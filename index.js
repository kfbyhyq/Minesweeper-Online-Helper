function showPage(pageId) {
    // 隐藏所有页面
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // 显示对应页面
    document.getElementById(pageId).classList.add('active');

    // 移除所有导航栏链接的活动样式
    document.querySelectorAll('#navbar a').forEach(link => {
        link.classList.remove('active');
    });

    // 为对应导航栏链接添加活动样式
    document.getElementById('nav-' + pageId).classList.add('active');
}

document.addEventListener('DOMContentLoaded', function() {
    // 初始化时显示首页
    showPage('statistic');
    // 获取导航数据的元素 添加点击事件监听器
    document.getElementById('nav-statistic').addEventListener('click', function(event) {
        showPage('statistic');
    });
    document.getElementById('nav-price').addEventListener('click', function(event) {
        showPage('price');
    });
    document.getElementById('nav-resource').addEventListener('click', function(event) {
        showPage('resource');
    });
    document.getElementById('nav-perfect').addEventListener('click', function(event) {
        showPage('perfect');
    });
    document.getElementById('nav-eventArena').addEventListener('click', function(event) {
        showPage('eventArena');
    });
    document.getElementById('nav-friendQuest').addEventListener('click', function(event) {
        showPage('friendQuest');
    });
    document.getElementById('nav-eventQuest').addEventListener('click', function(event) {
        showPage('eventQuest');
    });
    document.getElementById('nav-setting').addEventListener('click', function(event) {
        document.getElementById('saveSucc').style.display = "none";
        showPage('setting');
    });

    const currentDate = new Date();
    const dateMinus2 = new Date(currentDate);
    dateMinus2.setUTCDate(currentDate.getUTCDate() - 2);  // 每个月前两天划给上一个月
    switch ((dateMinus2.getUTCMonth() + 1) % 4) {
        case 0: 
            document.getElementById('nav-eventQuest').style.display = 'block';
            break;
        case 1:
            document.getElementById('nav-eventArena').style.display = 'block';
            break;
        case 2:
            document.getElementById('nav-friendQuest').style.display = 'block';
            break;
        case 3:
            break;
    }
});

/* 打开页面功能 */
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('statisticPage').addEventListener('click', function () {
        const pId = document.getElementById('pIdNow').innerText;
        if (pId) {
            const u = 'https://minesweeper.online/cn/statistics/' + pId;
            chrome.tabs.create({ url: u, active: true });
        } else {
            window.alert('请先设置用户ID');
        }
    });
    document.getElementById('marketPage').addEventListener('click', function () {
        chrome.tabs.create({ url: 'https://minesweeper.online/cn/marketplace', active: true });
    });
    document.getElementById('arenaPage').addEventListener('click', function () {
        chrome.tabs.create({ url: 'https://minesweeper.online/cn/arena', active: true });
    });
    document.getElementById('playerPage').addEventListener('click', function () {
        const pId = document.getElementById('pIdNow').innerText;
        if (pId) {
            const u = 'https://minesweeper.online/cn/player/' + pId;
            chrome.tabs.create({ url: u, active: true });
        } else {
            window.alert('请先设置用户ID');
        }
    });
    document.getElementById('friendQuestPage').addEventListener('click', function () {
        chrome.tabs.create({ url: 'https://minesweeper.online/cn/friend-quests', active: true });
    });
    document.getElementById('eventQuestPage').addEventListener('click', function () {
        chrome.tabs.create({ url: 'https://minesweeper.online/cn/event-quests', active: true });
    });
    document.getElementById('personEcoPage').addEventListener('click', function () {
        chrome.tabs.create({ url: 'https://minesweeper.online/cn/economy', active: true });
    });
});

/* 收起与展开 */
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('showPeDaily').addEventListener('click', function () {
        if (document.getElementById('showPedFlag').textContent == 1) {
            document.getElementById('showPeDaily').textContent = '展开财产变化';
            document.getElementById('peDaily').style.display = "none";
            document.getElementById('showPedFlag').textContent = 0;
        } else {
            document.getElementById('showPeDaily').textContent = '收起财产变化';
            document.getElementById('peDaily').style.display = "block";
            document.getElementById('showPedFlag').textContent = 1;
        }
    });
});

/* 设置页 */
document.addEventListener('DOMContentLoaded', function() {
    /* 读当前设置 */
    chrome.storage.local.get('pId', function (result) {
        const pId = result.pId;
        if (pId) {
            document.getElementById('pIdNow').innerText = pId;
            document.getElementById('personalId').placeholder = pId;
        } else {
            document.getElementById('personalId').placeholder = '请设置账号';
        }
    });
    chrome.storage.local.get('autoUpdate', function (result) {
        const autoUpdate = result.autoUpdate;
        document.getElementById('toggleSwitch1').checked = autoUpdate[0][0];
        document.getElementById("hourSelect1").value = autoUpdate[0][1];
        document.getElementById("minuteSelect1").value = autoUpdate[0][2];
        document.getElementById("secondSelect1").value = autoUpdate[0][3];
        document.getElementById('toggleSwitch2').checked = autoUpdate[1][0];
        document.getElementById("hourSelect2").value = autoUpdate[1][1];
        document.getElementById("minuteSelect2").value = autoUpdate[1][2];
        document.getElementById("secondSelect2").value = autoUpdate[1][3];
        document.getElementById('toggleSwitch3').checked = autoUpdate[2][0];
        document.getElementById("hourSelect3").value = autoUpdate[2][1];
        document.getElementById("minuteSelect3").value = autoUpdate[2][2];
        document.getElementById("secondSelect3").value = autoUpdate[2][3];
        document.getElementById('toggleSwitchAt').checked = autoUpdate[3][0];
    });
    /* 自动刷新下拉菜单 */
    const h1 = document.getElementById("hourSelect1");
    const m1 = document.getElementById("minuteSelect1");
    const s1 = document.getElementById("secondSelect1");
    const h2 = document.getElementById("hourSelect2");
    const m2 = document.getElementById("minuteSelect2");
    const s2 = document.getElementById("secondSelect2");
    const h3 = document.getElementById("hourSelect3");
    const m3 = document.getElementById("minuteSelect3");
    const s3 = document.getElementById("secondSelect3");
    for (let hour = 0; hour < 24; hour++) { // 生成小时选项
        let o1 = document.createElement("option");
        o1.value = hour;
        o1.textContent = String(hour).padStart(2, '0'); // 格式化小时
        h1.appendChild(o1);
        let o2 = document.createElement("option");
        o2.value = hour;
        o2.textContent = String(hour).padStart(2, '0'); // 格式化小时
        h2.appendChild(o2);
        let o3 = document.createElement("option");
        o3.value = hour;
        o3.textContent = String(hour).padStart(2, '0'); // 格式化小时
        h3.appendChild(o3);
    }
    for (let min = 0; min < 60; min++) { // 生成分钟选项
        let o1 = document.createElement("option");
        o1.value = min;
        o1.textContent = String(min).padStart(2, '0'); // 格式化分钟
        m1.appendChild(o1);
        let o2 = document.createElement("option");
        o2.value = min;
        o2.textContent = String(min).padStart(2, '0'); // 格式化分钟
        m2.appendChild(o2);
        let o3 = document.createElement("option");
        o3.value = min;
        o3.textContent = String(min).padStart(2, '0'); // 格式化分钟
        m3.appendChild(o3);
    }
    for (let sec = 0; sec < 60; sec++) { // 生成秒钟选项
        let o1 = document.createElement("option");
        o1.value = sec;
        o1.textContent = String(sec).padStart(2, '0'); // 格式化秒钟
        s1.appendChild(o1);
        let o2 = document.createElement("option");
        o2.value = sec;
        o2.textContent = String(sec).padStart(2, '0'); // 格式化秒钟
        s2.appendChild(o2);
        let o3 = document.createElement("option");
        o3.value = sec;
        o3.textContent = String(sec).padStart(2, '0'); // 格式化秒钟
        s3.appendChild(o3);
    }
    /* 保存设置 */
    document.getElementById('saveSetting').addEventListener('click', function () {
        var autoUpdate = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0]];
        autoUpdate[0][0]  = document.getElementById("toggleSwitch1").checked;
        if (autoUpdate[0][0]) {
            dailyTaskUpdate();
        }
        autoUpdate[0][1] = h1.value;
        autoUpdate[0][2] = m1.value;
        autoUpdate[0][3] = s1.value;

        autoUpdate[1][0]  = document.getElementById("toggleSwitch2").checked;
        if (autoUpdate[1][0]) {
            dailyTaskEventArena();
        }
        autoUpdate[1][1] = h2.value;
        autoUpdate[1][2] = m2.value;
        autoUpdate[1][3] = s2.value;

        autoUpdate[2][0]  = document.getElementById("toggleSwitch3").checked;
        if (autoUpdate[2][0]) {
            dailyTaskFriendQuest();
        }
        autoUpdate[2][1] = h3.value;
        autoUpdate[2][2] = m3.value;
        autoUpdate[2][3] = s3.value;

        autoUpdate[3][0]  = document.getElementById("toggleSwitchAt").checked;

        chrome.storage.local.set({ autoUpdate: autoUpdate });

        const pId = document.getElementById('personalId').value;
        if (pId.trim() === "") {
            document.getElementById('saveSucc').innerText = "保存成功！"
            document.getElementById('saveSucc').style.display = "block";
        } else if (!isNaN(pId)) {
            chrome.storage.local.set({ pId: pId });
            document.getElementById('pIdNow').innerText = pId;
            document.getElementById('personalId').placeholder = pId;
            document.getElementById('saveSucc').innerText = "保存成功！"
            document.getElementById('saveSucc').style.display = "block";
        } else {
            document.getElementById('saveSucc').innerText = "ID格式错误"
            document.getElementById('saveSucc').style.display = "block";
        }
    });
    /* 备份数据 */
    document.getElementById('backupButton').addEventListener('click', function () {
        chrome.storage.local.get(null, function (result) {
            const jsonData = JSON.stringify(result, null, 2); // 格式化 JSON
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            const currentDate = new Date();
            const d = currentDate.getUTCFullYear() + String(currentDate.getUTCMonth() + 1).padStart(2, '0') + String(currentDate.getUTCDate()).padStart(2, '0');
            a.download = 'WoM_helper_backup-' + d + '.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url); // 释放 URL 对象
        });
    });
    /* 恢复数据 */
    document.getElementById('restoreButton').addEventListener('click', function () {
        document.getElementById('restoreInput').click(); // 点击button触发input
    });
    document.getElementById('restoreInput').onchange = function(event) {
        const file = event.target.files[0]; // 获取选中的文件
        const reader = new FileReader();
        // 成功读取后解析文件
        reader.onload = function (event) {
            try {
                const dataIn = JSON.parse(event.target.result);
                chrome.storage.local.get(null, function(result) {
                    /* 宝石场币 */
                    const gpMap = result.gemsPriceMap || {};
                    const gpMapIn = dataIn['gemsPriceMap'];
                    for (const key in gpMapIn) {
                        gpMap[key] = gpMapIn[key];
                    }
                    chrome.storage.local.set({ gemsPriceMap: gpMap });
                    /* 竞技场门票 */
                    const tpMap = result.ticketPriceMap || {};
                    const tpMapIn = dataIn['ticketPriceMap'];
                    for (const key in tpMapIn) {
                        tpMap[key] = tpMapIn[key];
                    }
                    chrome.storage.local.set({ ticketPriceMap: tpMap });
                    /* 游戏数据 */
                    const stMap = result.statisticsMap || {};
                    const stMapIn = dataIn['statisticsMap'];
                    for (const key in stMapIn) {
                        stMap[key] = stMapIn[key];
                    }
                    chrome.storage.local.set({ statisticsMap: stMap });
                    /* 个人数据 */
                    const pdMap = result.personalDataMap || {};
                    const pdMapIn = dataIn['personalDataMap'];
                    for (const key in pdMapIn) {
                        pdMap[key] = pdMapIn[key];
                    }
                    chrome.storage.local.set({ personalDataMap: pdMap });
                    /* 财产数据 */
                    const peMap = result.personalEcoMap || {};
                    const peMapIn = dataIn['personalEcoMap'];
                    for (const key in peMapIn) {
                        peMap[key] = peMapIn[key];
                    }
                    chrome.storage.local.set({ personalEcoMap: peMap });
                    /* 活动竞技场 */
                    const eapMap = result.eaPriceMap || {};
                    const eapMapIn = dataIn['eaPriceMap'];
                    for (const key in eapMapIn) {
                        eapMap[key] = eapMapIn[key];
                    }
                    chrome.storage.local.set({ eaPriceMap: eapMap });
                    /* 友谊任务 */
                    const fqInfo = result.friendQuestInfo || {};
                    const fqInfoIn = dataIn['friendQuestInfo'];
                    for (const month in fqInfoIn) {
                        if (!fqInfo[month]) {
                            fqInfo[month] = fqInfoIn[month];
                        } else {
                            for (const qsid in fqInfoIn[month].fqSend) {
                                fqInfo[month].fqSend[qsid] = fqInfoIn[month].fqSend[qsid];
                            }
                            for (const qrid in fqInfoIn[month].fqReceive) {
                                fqInfo[month].fqReceive[qrid] = fqInfoIn[month].fqReceive[qrid];
                            }
                            // fqInfo[month].fqSend = { ...fqInfoIn[month].fqSend, ...fqInfo[month].fqSend };
                            // fqInfo[month].fqReceive = { ...fqInfoIn[month].fqReceive, ...fqInfo[month].fqReceive };
                        }
                    }
                    chrome.storage.local.set({ friendQuestInfo: fqInfo });

                    let acMap = result.activityMap || {};
                    const acMapIn = dataIn['activityMap'];
                    for (const date in acMapIn) {
                        acMap[date] = acMapIn[date]
                    }
                    chrome.storage.local.set({ activityMap: acMap });

                    let fqDaily = result.friendQuestDaily || {};
                    const fqDailyIn = dataIn['friendQuestDaily'];
                    for (const date in fqDailyIn) {
                        if (!fqDaily[date]) {
                            fqDaily[date] = fqDailyIn[date];
                        } else {
                            fqDaily[date].fqSend = { ...fqDailyIn[date].fqSend, ...fqDaily[date].fqSend };
                            fqDaily[date].fqReceive = { ...fqDailyIn[date].fqReceive, ...fqDaily[date].fqReceive };
                        }
                    }
                    chrome.storage.local.set({ friendQuestDaily: fqDaily });
                    /* 设置 */
                    const pId = result.pId
                    if (pId) {
                        chrome.storage.local.set({ pId: pId });
                    }
                    const autoUpdate = result.autoUpdate
                    if (autoUpdate) {
                        chrome.storage.local.set({ autoUpdate: autoUpdate });
                    }
                });
                // location.reload();
                console.log('恢复数据成功');
            } catch (error) {
                console.error('恢复数据失败', error);
                window.alert('恢复数据失败');
            }
        };
        reader.readAsText(file); // 读取文件
    };
});

 /* 每日更新数据 */
function dailyTaskUpdate() {
    const now = new Date();
    const clock = new Date();
    var tw;
    var h;
    var m;
    var s;
    chrome.storage.local.get('autoUpdate', function (result) {
        const autoUpdate = result.autoUpdate;
        if (autoUpdate && autoUpdate[0]) {
            tw = autoUpdate[0][0];
            h = autoUpdate[0][1];
            m = autoUpdate[0][2];
            s = autoUpdate[0][3];
            clock.setHours(h, m, s, 0); // 设置更新时间
            // 如果现在时间已经过了，设置为明天的同一时间
            if (now > clock) {
                clock.setDate(now.getDate() + 1);
            }
            // 创建闹钟
            if (tw) {
                chrome.alarms.create('updateData', { when: clock.getTime() });
            }
        }
    });
}
// 设置首次调度
dailyTaskUpdate();
// 监听闹钟事件
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'updateData') {
        document.getElementById('update').click();
        // 重新调度下一天的任务
        dailyTaskUpdate();
    }
});

/* 每日更新活动竞技场 */
function dailyTaskEventArena() {
    const now = new Date();
    const clock = new Date();
    var tw;
    var h;
    var m;
    var s;
    chrome.storage.local.get('autoUpdate', function (result) {
        const autoUpdate = result.autoUpdate;
        if (autoUpdate && autoUpdate[1]) {
            tw = autoUpdate[1][0];
            h = autoUpdate[1][1];
            m = autoUpdate[1][2];
            s = autoUpdate[1][3];
            clock.setHours(h, m, s, 0); // 设置更新时间
            // 如果现在时间已经过了，设置为明天的同一时间
            if (now > clock) {
                clock.setDate(now.getDate() + 1);
            }
            // 创建闹钟
            const currentDate = new Date();
            if (tw && (currentDate.getUTCMonth() + 1) % 4 == 1) {
                chrome.alarms.create('updateEaTask', { when: clock.getTime() });
            }
        }
    });
}
// 设置首次调度
dailyTaskEventArena();
// 监听闹钟事件
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'updateEaTask') {
        document.getElementById('updateEa1').click();
        // 重新调度下一天的任务
        dailyTaskEventArena();
    }
});

/* 每日更新友谊任务 */
function dailyTaskFriendQuest() {
    const now = new Date();
    const clock = new Date();
    var tw;
    var h;
    var m;
    var s;
    chrome.storage.local.get('autoUpdate', function (result) {
        const autoUpdate = result.autoUpdate;
        if (autoUpdate && autoUpdate[2]) {
            tw = autoUpdate[2][0];
            h = autoUpdate[2][1];
            m = autoUpdate[2][2];
            s = autoUpdate[2][3];
            clock.setHours(h, m, s, 0); // 设置更新时间
            // 如果现在时间已经过了，设置为明天的同一时间
            if (now > clock) {
                clock.setDate(now.getDate() + 1);
            }
            // 创建闹钟
            const currentDate = new Date();
            if (tw && (currentDate.getUTCMonth() + 1) % 4 == 2 && currentDate.getUTCDay() > 3) {
                chrome.alarms.create('updateFqTask', { when: clock.getTime() });
            }
        }
    });
}
// 设置首次调度
dailyTaskFriendQuest();
// 监听闹钟事件
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'updateFqTask') {
        document.getElementById('updateFq').click();
        // 重新调度下一天的任务
        dailyTaskFriendQuest();
    }
});