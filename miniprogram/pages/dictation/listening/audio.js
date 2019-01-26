// pages/audio/audio.js
var wordDuration //记录单词有多少个
var beginTime = 0;
var endTime = 2;
var wordTimeInterval = 2000; //单词之间的时间间距
var nowWord //目前的单词是第几个
var innerAudioContext
var interval = null //记时函数
var autoPlayWord = null
var autoPlayLastWord = null
var book = 1; //记录是第几本书
var part = 1; //记录是第几个部分
var audioList; //记录单词
var nowWord;
var wordSum;
var wordPass;
var tempAudioPath = ''
// const emitter = new EventEmitter()
// emitter.setMaxListeners(100)//指定一个最大监听数量
// emitter.setMaxListeners(0)//或者关闭最大监听阈值




Page({
  /**
   * 页面的初始数据
   */
  data: {
    playJapanesePart: "第1课",
    wordDuration: "",
    wordNumber: 1,
    nowWord: 0,
    toView: 'red',
    scrollTop: 100,
    hidden: false,
    audioList: "",
    nowWord: "",
    definition: "",
    pronounce: "",
    description: "",
    percent: 1,
    wordSum: 0,
    wordPass: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      playJapanesePart: "第" + options.part + "课"
    })

    var that = this;
    let db = wx.cloud.database();
    let bookid = (options.book == '1') ? "wordlist1" : "wordlist2" //选择单词书
    db.collection(bookid).doc(parseInt(options.part)).field({
      section: true
    }).get().then(res => {
      console.log(res.data)
      var arr = res.data.section
      wordDuration = arr.length //单词量
      var idx = Math.floor(Math.random() * (wordDuration - 1))
      that.setData({
        hidden: !that.data.hidden,
        audioList: arr,
        nowWord: arr[idx],
        definition: arr[idx].content,
        pronounce: arr[idx].pron,
        description: arr[idx].definition,
        showNot: false,
      })

      wordSum = wordDuration
      wordPass = 0

      var eWord = that.data.nowWord.content
      var fdStart = eWord.indexOf("～");
      if (fdStart == 0) {
        //表示strCode是以~开头；
        eWord = that.data.nowWord.content.replace("～", "");
      }

      //TODO 此处需要根据不同的课本和part来改变
      innerAudioContext = wx.createInnerAudioContext()
      innerAudioContext.src = 'http://fanyi.baidu.com/gettts?lan=en&text=' + encodeURIComponent(eWord) + '&spd=3&source=web'
      innerAudioContext.autoplay = true

      innerAudioContext.onPlay(() => {
        // console.log('开始播放')
      })
      innerAudioContext.onError((res) => {
        // console.log(res.errMsg)
        // console.log(res.errCode)
      })

    })
    

  },


  onShow: function() {
    this.setData({
      wordNumber: 1
    })
  },

  onHide: function() {
    innerAudioContext.stop()
  },

  onUnload: function() {
    innerAudioContext.stop()
  },


  nextSound: function() {

    var that = this;
    //删掉已经听过的单词
    // console.log(that.data.audioList)
    var position = that.data.audioList.indexOf(that.data.definition)
    that.data.audioList.splice(position, 1)
    // console.log(that.data.audioList)


    //任选一个听写
    var idx = Math.floor(Math.random() * (that.data.audioList.length - 1))

    wordPass = wordPass + 1 //每次按下next都算是见过一次面了
    // console.log(wordPass)
    // console.log(wordSum)

    that.setData({
      //设置加载条
      nowWord: that.data.audioList[idx],
      definition: that.data.audioList[idx].content,
      pronounce: that.data.audioList[idx].pron,
      description: that.data.audioList[idx].definition,
      showNot: false,
      percent: wordPass * 100 / wordSum
    })

    var eWord = that.data.nowWord.content
    var fdStart = eWord.indexOf("～");
    if (fdStart == 0) {
      //表示strCode是以~开头；
      eWord = that.data.nowWord.content.replace("～", "");
    }

    //TODO 此处需要根据不同的课本和part来改变
    innerAudioContext.src = 'http://fanyi.baidu.com/gettts?lan=en&text=' + encodeURIComponent(eWord) + '&spd=3&source=web'
    innerAudioContext.autoplay = true
    // console.log(that.data.nowWord)

    innerAudioContext.onPlay(() => {
      // console.log('开始播放')
    })
    innerAudioContext.onError((res) => {
      // console.log(res.errMsg)
      // console.log(res.errCode)
    })

  },
  showAnswer: function() {
    this.setData({
      showNot: true
    })
  },

  stillSound: function() {
    var that = this
    var eWord = that.data.nowWord.content
    var fdStart = eWord.indexOf("～");
    if (fdStart == 0) {
      //表示strCode是以~开头；
      eWord = that.data.nowWord.content.replace("～", "");
    }

    //TODO 此处需要根据不同的课本和part来改变
    innerAudioContext.src = 'http://fanyi.baidu.com/gettts?lan=en&text=' + encodeURIComponent(eWord) + '&spd=3&source=web'
    innerAudioContext.autoplay = true
    // console.log(that.data.nowWord)

    innerAudioContext.onPlay(() => {
       console.log('开始播放')
    })
    innerAudioContext.onError((res) => {
       console.log(res.errMsg)
       console.log(res.errCode)
    })
  }
})