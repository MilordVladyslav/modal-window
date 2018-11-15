var gulp = require('gulp'),
    less = require('gulp-less'),
    browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglifyjs')
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
//  pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer')

gulp.task('less', function () {
    return gulp.src('app/less/all.less') 
    .pipe(less())
    .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({stream: true}))
})

gulp.task('scripts', function () {
    return gulp.src([
        
        'app/libs/jquery/dist/jquery.min.js',
        'app/libs/bootstrap/dist/bootstrap.min.js',
        'app/libs/bootstrap/js/modal.js'
    ]) 
        .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/js'))
})

gulp.task('styles', ['less', 'fonts'], function () {
    return gulp.src([
        'app/libs/bootstrap/dist/css/bootstrap-theme.min.css',
        'app/libs/bootstrap/dist/css/bootstrap.min.css',
        'app/libs/reset-css/reset.less'
    ]) 
        .pipe(concat('libs.css'))
        .pipe(cssnano())
        .pipe(rename({ suffix: '.min'}))
        .pipe(gulp.dest('app/css'))
})
gulp.task('fonts', function () {
    return gulp.src([
        'app/libs/bootstrap/fonts/*'
    ])
        .pipe(gulp.dest('app/fonts'))
})

gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: 'app',
            notify: false
        }
    })
})

gulp.task('clean', function () {
    return del.sync('dist')
})

gulp.task('clear-cache', function () {
    return cache.clearAll()
})

gulp.task('img', function () {
    return gulp.src([
        'app/img/**/*'
    ])
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgPlugins: [{removeViewBox: false}]
        //  une: [pngquant()]
        })))
        .pipe(gulp.dest('dist/img'))
})

// gulp.task('css-images', function () {
//     return gulp.src([
//         'app/libs/slider-pro/dist/css/images/*'
//     ])
//         .pipe(gulp.dest('app/css/images'))
// })

gulp.task('watch', ['browser-sync', 'styles', 'scripts'], function () {
    gulp.watch('app/less/**/*.less', ['less'])
    gulp.watch('app/**/*.html', browserSync.reload)
    gulp.watch('app/js/**/*.js', browserSync.reload)
})

gulp.task('build', ['clean', 'styles', 'scripts', 'img'], function () {
    var buildHtml = gulp.src([
            'app/*.html',
        ])
        .pipe(gulp.dest('dist'))
        buildCss = gulp.src([
            'app/css/all.css',
            'app/css/libs.min.css'
        ])
        .pipe(gulp.dest('dist/css')),
        buildCssImages = gulp.src([
            'app/css/images/*'
        ])
            .pipe(gulp.dest('dist/css/images')),
        buildFonts = gulp.src([
            'app/fonts/**/*',
        ])
        .pipe(gulp.dest('dist/fonts')),
        buildJs = gulp.src([
            'app/js/**/*',
        ])
        .pipe(gulp.dest('dist/js'))
        
})