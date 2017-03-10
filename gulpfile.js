
var gulp = require('gulp'),
    connect=require("gulp-connect"),
    sass=require("gulp-sass");
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
//编译sass
gulp.task('sass',function(){
    gulp.watch(['static/sass/*.scss'],function(){
        gulp.src('static/sass/*.scss')
            .pipe(sass())
            .pipe(gulp.dest('static/css'))
    })
})
//监听所有html文件，改动了触发上一条任务
gulp.task('watch',function(){
    gulp.watch(['*.html',"static/css/*.css",'js/*.js'],['html','sass'])
})
//default默认起服务和监听
gulp.task('default',['connect','watch'])

