# Minesweeper Online Helper 在线扫雷网（WoM）助手

基于Chrome内核浏览器的WoM (https://minesweeper.online/) 插件，用于统计游戏数据。

## 如何使用

插件主页 -> "<>code" -> "Download ZIP"

下载的压缩包解压到任意位置

浏览器 -> "扩展" -> "管理扩展" -> 打开"开发人员模式" -> "加载解压缩的扩展" -> 选择解压后的文件夹

使用时请先打开"主界面" -> "设置" -> 设置"当前登录账号uId"

## 插件弹出页

在浏览器插件栏点击插件图标可以打开插件弹出页，各按钮在可使用的页面会变为蓝色并可点击，作用分别为：

*打开主界面*：打开插件主界面

*刷新宝石/场币价格*：在**市场**首页（即分类选全部）采集所有宝石、竞技场币、碎片的最低市场价

*刷新竞技场门票价格*：在**市场**页采集所有竞技场门票的最低市场价，比较慢，等待按键变绿为成功

*刷新装备加成*：在**装备**页采集当前装备加成情况

*刷新游戏数据*：在**数据统计**页勾选**我的数据**时，采集当前账号游戏数据

*刷新个人数据*：在**我的主页**页采集当前页面账号奖杯、装备、资源数据。（可以在他人主页生效，但会覆盖个人数据）

*刷新财产估值*：在**商店**->**游戏经济**页采集今日财富估值

*刷新活动门票价格*：只在活动门票月生效，在**市场**页采集所有活动竞技场门票的最低市场价

*刷新友谊任务列表*：只在友谊任务月生效，在**活动任务**页采集**发送任务**、**收到的任务**当前页、**已发送的任务**当前页中的任务信息，第一次使用时可以对**收到的任务**和**已发送的任务**的每一页点击一次按钮来采集所有任务

*刷新活动任务*：只在全球任务月生效，在**活动任务**页根据近期任务分析下一个任务的信息

## 插件主界面

*游戏数据*：显示最近一次采集的游戏数据；根据历史数据计算每日增量。如果两天之间的若干天没有采集，后一天显示的数据是这些天数据之和

*当前市价*：显示最近一次采集到的市场最低价；竞技场门票收益估值计算和当前账号装备加成有关

*历史价格*：根据插件每天采集到的市场价，显示历史价格比较；如果出现异常数据可以手动修改单个数据

*个人数据*：显示最近一次采集到的个人资源、装备加成、财产、奖杯数据；根据历史数据记录财产每日增量和奖杯变化时刻

*活动商店*：根据当前市场最低价，计算兑换不同项目时活动物品相当于多少金币

*完美装备*：根据当前价格和资源，展示制作完美装备的信息

*活动竞技场*：显示最近一次采集到的活动竞技场门票市场最低价，点击“最低价”行可手动输入价格，点击**手动刷新价格**保存；点击**自动刷新价格**会打开**竞技场**页自动提取并关闭，效果等同插件页的**刷新活动门票价格**

*友谊任务*：显示本月友谊任务累计、每日统计信息；点击**刷新任务**会打开**活动任务**页自动提取并关闭，效果等同插件页的**刷新友谊任务列表**；为了保证昨日活跃度正确计算，尽量在每日最后一次游戏后更新友谊任务数据或设置定时自动刷新

*全球任务*：点击活动任务分析会后台打开**活动任务**页分析并关闭，效果等同插件页的**刷新活动任务**。

*刷新数据*：打开**市场**、**竞技场**、**数据统计（我的数据）**、**我的主页**自动提取信息并关闭，竞技场页会比较慢，等待自行关闭即可，可在设置中选择前台或后台提取（后台更慢）

*设置*：设置账号uid、估价相关参数、自动刷新、备份数据和恢复备份。自动刷新功能目前不太靠谱，需要保持插件主界面打开，浏览器后台或电脑锁屏时不一定生效

