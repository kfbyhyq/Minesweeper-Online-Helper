document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('button0').addEventListener('click', function() {
        chrome.tabs.create({ url: chrome.runtime.getURL('main.html') });
    });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'sendGemsPrice') {
        let gemsPrice = request.gemsPrice;
        console.log('Received data:', gemsPrice);   // 在控制台打出结果
        chrome.storage.local.set({ gemsPrice: gemsPrice });     // 保存数据
        const button = document.getElementById('button1');
        button.style.backgroundColor = '#4caf50';   // 将对应按钮变为绿色，表示提取成功
    } else if (request.action === 'sendTicketPrice') {
        let ticketPrice = request.ticketPrice;
        console.log('Received data:', ticketPrice);
        chrome.storage.local.set({ ticketPrice: ticketPrice });
        const button = document.getElementById('button2');
        button.style.backgroundColor = '#4caf50';
    } else if (request.action === 'sendPersonalData') {
        let personalData = request.personalData;
        console.log('Received data:', personalData);
        chrome.storage.local.set({ personalData: personalData });
        const button = document.getElementById('button3');
        button.style.backgroundColor = '#4caf50';
    } 
});