const { src, dest, parallel, series, watch } = require('gulp')

const del = require('del');
const loadPlugins = require('gulp-load-plugins');
const browserSync = require('browser-sync');

const plugins = loadPlugins();
const bs = browserSync.create();

const clean = () => {
    return del(['dist', 'temp'])
}

const style = () => {
    return src('src/assets/styles/*.scss', { base: 'src' })
        .pipe(plugins.sass({ outputStyle: 'expended' }))
        .pipe(dest('temp'))
        .pipe(bs.reload({ stream: true }))
}

const lint = () => {
    return src('src/assets/scripts/*.js', { base: 'src' })
        .pipe(plugins.eslint())
        .pipe(plugins.eslint.format())
        .pipe(plugins.eslint.failAfterError());
}

const script = () => {
    return src('src/assets/scripts/*.js', { base: 'src'})
        .pipe(plugins.babel({ presets: ['@babel/preset-env']}))
        .pipe(dest('temp'))
        .pipe(bs.reload({ stream: true }))
}

const lintAndCompileScript = series(lint, script);

const data = {
    menus: [{
        name: '主页',
        link: '/'
    },{
        name: '关于',
        link: '/about.html'
    }],
    title: 'gulp样板页面',
    pkg: require('./package.json'),
    dete: new Date()
}

const page = () => {
    return src('src/**/*.html', { base: 'src' })
        .pipe(plugins.swig({data}))
        .pipe(dest('temp'))
        .pipe(bs.reload({ stream: true }))
}

const image = () => {
    return src('src/assets/images/**', { base: 'src' })
        .pipe(plugins.imagemin())
        .pipe(dest('dist'))
}

const font = () => {
    return src('src/assets/fonts/**', { base: 'src' })
        .pipe(plugins.imagemin())
        .pipe(dest('dist'))
}

const extra = () => {
    return src('public/**', { base: 'public' })
        .pipe(dest('dist'))
}

const startDevServer = () => {
    watch('src/assets/scripts/*.js', lintAndCompileScript);
    watch('src/assets/styles/*.scss', style);
    watch('src/**/*.html', page);
    watch([
        'src/assets/images/**',
        'src/assets/fonts/**',
        'public/**'
    ], bs.reload)

    bs.init({
        notify: false,
        port: 3001,
        server: {
            baseDir: ['temp', 'src', 'public'],
            routes: {
                '/node_modules': 'node_modules'
            }
        }
    })
}

const useref = () => {
    return src('temp/**/*.html', { base: 'temp' })
        .pipe(plugins.useref({ searchPath: ['temp', '.']}))
        .pipe(plugins.if(/\.js$/, plugins.uglify()))
        .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
        .pipe(plugins.if(/\.html$/, plugins.htmlmin({
            collapseWhitespace: true,
            minifyCss: true,
            minigyJS: true
        })))
        .pipe(dest('dist'))
}

const compileSrc = parallel(lintAndCompileScript, style, page)

const build = series(
    clean,
    parallel(
        series(compileSrc, useref),
        image,
        font,
        extra
    )
)

const serve = series(compileSrc, startDevServer);

const startProdServer = () => {
    bs.init({
        notify: false,
        port: 3002,
        server: {
            baseDir: ['dist'],
            routes: {
                '/node_modules': 'node_modules'
            }
        }
    })
}

const start = series(build, startProdServer);

module.exports = {
    clean,
    lint,
    serve,
    build,
    start,
}