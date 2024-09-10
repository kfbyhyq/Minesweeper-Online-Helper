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
    document.getElementById("nav-statistic").addEventListener("click", function(event) {
        showPage('statistic'); // 调用 showPage 函数
    });
    document.getElementById("nav-price").addEventListener("click", function(event) {
        showPage('price'); // 调用 showPage 函数
    });
    document.getElementById("nav-resource").addEventListener("click", function(event) {
        showPage('resource'); // 调用 showPage 函数
    });
    document.getElementById("nav-perfect").addEventListener("click", function(event) {
        showPage('perfect'); // 调用 showPage 函数
    });
    document.getElementById("nav-eventArena").addEventListener("click", function(event) {
        showPage('eventArena'); // 调用 showPage 函数
    });
    document.getElementById("nav-eventQuest").addEventListener("click", function(event) {
        showPage('eventQuest'); // 调用 showPage 函数
    });

    const currentDate = new Date();
    if ((currentDate.getMonth() + 1) % 4 != 0) {
        document.getElementById("nav-eventQuest").style.display = 'none';
    }
    if ((currentDate.getMonth() + 1) % 4 != 1) {
        document.getElementById("nav-eventArena").style.display = 'none';
    }
});

 /* 每日更新数据 */
function dailyTaskUpdate() {
    const now = new Date();
    const noon = new Date();
    noon.setHours(23, 0, 0, 0); // 设置更新时间
 
    // 如果现在时间已经过了，设置为明天的同一时间
    if (now > noon) {
        noon.setDate(now.getDate() + 1);
    }
 
    // 创建闹钟
    chrome.alarms.create('updateData', { when: noon.getTime() });
}
// 设置首次调度
dailyTaskUpdate();
// 监听闹钟事件
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'updateData') {
        document.querySelector('#update').click();
        // 重新调度下一天的任务
        dailyTaskUpdate();
    }
});
