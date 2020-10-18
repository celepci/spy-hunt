// gulp'u dahil edelim
const gulp = require('gulp');
const changed = require('gulp-changed');

// eklentileri dahil edelim
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const pug = require('gulp-pug');
const fsCache = require('gulp-fs-cache');
const autoprefix = require('gulp-autoprefixer');

const browser_sync = require('browser-sync').create();

const images_path = './src/assets/img/**/*.{gif,svg,jpg,jpeg,png,webp}';
const fonts_path = './src/assets/fonts/**/*.{eot,svg,ttf,woff,woff2}';



// Sass dosyalarını işler, browser uyumluluğu sağlar,
// ve oluşturulan CSS dosyasını CSS klasörüne kaydeder.
gulp.task('css', function () {
    const cssFsCache = fsCache('tmp/csscache');

    return gulp.src('./src/scss/style.scss')
        .pipe(cssFsCache)
        .pipe(sass({outputStyle: 'compressed'})).on('error', function (err) {
            console.log(err.toString());
            this.emit('end');
        })
        .pipe(cssFsCache.restore)
        .pipe(autoprefix('last 15 version'))
        .pipe(gulp.dest('dist/css'))
        .pipe(browser_sync.stream());
});


// JS dosyalarını sıkıştırır
// ve hepsini birleştirerek JS klasörüne kaydeder.
gulp.task('js', function () {
    const jsFsCache = fsCache('tmp/jscache');
    return gulp.src('./src/js/**/*.js')
        .pipe(jsFsCache)
        .pipe(uglify()).on('error', function (err) {
        console.log(err.toString());
        this.emit('end');
        })
        .pipe(jsFsCache.restore)
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(browser_sync.stream());
});

/*
gulp.task('html', function () {
	gulp.src('./!*.html')
		.pipe(browser_sync.stream());
});
*/

gulp.task('pug', function () {
    return gulp.src('./src/views/*.pug')
        //.pipe(changed('dist', {extension: '.html'}))
        .pipe(pug({
            pretty:true
        }).on('error', function (err) {
            console.log(err.toString());
            this.emit('end');
        }))
        .pipe(gulp.dest('dist'))
        .pipe(browser_sync.stream());

});
// İzlemeye alınan işlemler

gulp.task('move_images', function() {
	return gulp.src(images_path).pipe(gulp.dest('dist/img'));
});

gulp.task('move_fonts', function() {
	return gulp.src(fonts_path).pipe(gulp.dest('dist/fonts'));
});

gulp.task('watch', function () {
    browser_sync.init({
        server: 'dist',
        files: ["dist/css/style.css", "dist/js/*.js", "dist/*.html"],
        browser: "chrome",
        online: true,
        tunnel: true,
    })
    // gulp.watch('./*.html', ['html']);
    gulp.watch('./src/views/**/*.pug', {usePolling:true},gulp.series('pug'));
    gulp.watch('./src/scss/**/*.scss', gulp.series('css'));
    gulp.watch('./src/js/**/*.js', gulp.series('js'));
	gulp.watch(fonts_path, gulp.series('move_fonts'));
	gulp.watch(images_path, gulp.series('move_images'));
    //gulp.watch('./src/images/**/*.{png,jpg,jpeg}', ['img']);
});

// Gulp çalıştığı anda yapılan işlemler
gulp.task('default', gulp.series('css', 'js', 'pug', 'move_fonts', 'move_images', 'watch', function(){}));
