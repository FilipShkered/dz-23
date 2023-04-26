const {
    src,
    dest,
    series,
    parallel
} = require('gulp')
const concat = require('gulp-concat');
const clean = require('gulp-clean');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const { watch } = require('browser-sync');
const browserSync = require('browser-sync').create();
const { path } = require('./gulp/const.js')


function serveTask(done) {
    browserSync.init({
        server: {
            baseDir: path.dest
        }
    });
    watch('./src/index.html', series(copyHtmlTask, reloadBrowser))
    watch('./src/**/*.js', series(copyJsTask, reloadBrowser))
    watch('./src/**/*.css', series(copyCssTask, reloadBrowser))
    done()
}

function reloadBrowser(done) {
    browserSync.reload();
    done();
}

function buildTask() {
    return series(cleanDistTask, parallel(copyHtmlTask, copyJsTask, copyCssTask, copyJsVendorTask, copyImgTask))

}



function copyHtmlTask() {
    return src('./src/index.html')
        .pipe(dest(path.dest))
}


function copyJsTask() {
    return src([
            './src/model/TodoApi.js',
            './src/model/Collection.js',
            './src/view/TodoFormView.js',
            './src/view/TodoListView.js',
            './src/Controller.js',
            './src/script/index.js',
            './src/',

        ])
        .pipe(concat('app.js'))
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(dest(path.dest))
}


function copyJsVendorTask() {
    return src('/Users/filipshkered/Google Диск/Education/IT/frontend_pro/23-dz/node_modules/jquery/dist/jquery.min.js')
        .pipe(concat('vendor.js'))
        .pipe(dest(path.dest))
}


function copyCssTask() {
    return src('./src/**/*.css')
        .pipe(concat('app.css'))
        .pipe(dest(path.dest))
}

function copyImgTask() {
    return src('./src/img/*')
        .pipe(dest('./dist/img'))
}

function cleanDistTask() {
    return src(path.dest, {
        read: false,
        allowEmpty: true
    }).pipe(clean())
}
exports.build = buildTask()
exports.serve = series(buildTask(), serveTask)