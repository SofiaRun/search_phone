var gulp=require("gulp"),
	webserver=require("gulp-webserver");
gulp.task("server",function(){
	gulp.src("./src")
		.pipe(webserver({
			port:4445,
			livereload:true,
			directoryList:true,
			open:"index.html"
	}))
})