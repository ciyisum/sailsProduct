/**************************/
/*******推送rtmp接口示例*******/
/**************************/

IS_CONSOLE_LOG = true;//是否打印日志信息

/*
Script 提供的回调接口,swf在请求数据过程中会产生以下几种状态
1、onInit 上传组件初始化完成
2、onCUpload 当前正在进行图片上传
3、onSelect 选中上传文件
4、onIoError 上传IO错误
5、onSecurityError 上次策略文件错误
6、onProgress 文件上传进度
7、onLog 调试函数
8、onComp 图片上传完毕
9、onError 上传过程中引起的其他错误
10、onFileSize 当选择的文件大小超过设定的大小时执行该回调
11、onInvalidFile 当选择无效文件时候回调该函数
12、onUploadError 文件上传失败
13、startUpload 当设置为不自动上传时，通过调用该函数开始上传文件
14、noSelected 当设置为不自动上传文件时，没有选择文件或者传递网络地址就调用startUpload函数时候返回的错误
15、cancelFileState 取消标识的文件状态，可以用于继续上传文件
以下为swf回调示例
*/
function onInit(value, objectID) {
    console.log("function onInit " + value);
	onLog(value, objectID);
}

function onCUpload(value, objectID) {
    console.log("function onCUpload " + value);
	onLog(value, objectID);
}

function onSelect(value, objectID) {
    console.log("function onSelect " + value);
	onLog(value, objectID);
}

function onIoError(value, objectID) {
    console.log("function onIoError " + value);
	onLog(value, objectID);
}

function onSecurityError(value, objectID) {
    console.log("function onSecurityError " + value);

    onLog(value, objectID);
}

function onError(value, objectID) {
    console.log("function onError " + value);

    onLog(value, objectID);
}

function onProgress(value, objectID) {
    console.log("function onProgress " + value);

    onLog(value, objectID);
}

function onLog(value, objectID) {
	// alert(value + ":" + objectID);
	// message = decodeURIComponent(message);
	var log = "log " + objectID + " " + value;
	if (IS_CONSOLE_LOG) console.log(log);
	logger.log(log);
}

function onComp(value, objectID) {
    console.log("function onComp " + value);

    onLog(value, objectID);
}

function onFileSize(value, objectID) {
	// alert(value);
    console.log("function onFileSize " + value);

    onLog(value, objectID);
}

function onInvalidFile(value, objectID) {
    console.log("function onInvalidFile " + value);

    onLog(value, objectID);
}

function onUploadError(value, objectID) {
    console.log("function onUploadError " + value);

    onLog(value, objectID);
}

/*Script 提供的回调接口*/

////////////////////////////////////////////////////////
/**flash 对外提供的交互接口*/
/*
1、__netUpload 上传网络图片
*/

/*getSwf  获取swf对象*/
function getSwf() {
	return document.ImageUpload;
}

// 上传网络图片
function netUpload() {
	var netSrc = text.value;
	// var width = text1.value;
	// var height = text2.value; 
	getSwf().__netUpload(netSrc);
	// getSwf().__netUpload(netSrc, width, height);
}

function netUpload2() {
	var netSrc = text2.value;
	// var width = text1.value;
	// var height = text2.value; 
	getSwf().__netUpload(netSrc);
	// getSwf().__netUpload(netSrc, width, height);
}

function startUpload() {
	getSwf().startUpload()
}

function cancelFileState() {
	getSwf().cancelFileState()
}

function noSelected(value, objectID) {

	onLog(value, objectID,'noSelected');
}
