
var gulp = require('gulp'),
    connect=require("gulp-connect");
//起服务
gulp.task('connect',function(){
    connect.server({
        port: 8001,
        livereload: true

    })
}) 
//刷新所有html
gulp.task('html',function(){
    gulp.src('*.html')
        .pipe(connect.reload());
})
//监听所有html文件，改动了触发上一条任务
gulp.task('watch',function(){
    gulp.watch(['*.html',"css/*.css",'js/*.js'],['html'])
})
//default默认起服务和监听
gulp.task('default',['connect','watch'])

