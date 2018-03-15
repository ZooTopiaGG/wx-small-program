export default {
  author: 'deng peng',
  data: {
    top: 11,
    left: 20,
    poi:[
      {
        top: 11,
        left: 20,
      },
      {
        top: 11,
        left: 20,
      },
    ]
  },
  stars (w, h, n) {
    for (var i=0; i<10; i++) {
     this.data.poi[i] = {
       top: Math.random() * h,
       left: Math.random() * w
     } 
    }
    // this.data.top = Math.random() * h
    // this.data.left = Math.random() * w
    return this.data.poi
  }
}