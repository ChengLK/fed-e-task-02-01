// 实现这个项目的构建任务

const sass = require('sass');
const isProd = process.argv.includes('--production')
const data = {
    menus: [{
        name: '主页',
        link: '/'
    },{
        name: '关于',
        link: '/about.html'
    }],
    title: 'grunt样板',
    pkg: require('./package.json'),
    dete: new Date()
}

module.exports = grunt => {
    require('load-grunt-tasks')(grunt);
    grunt.initConfig({
        clean: {
            temp: 'temp/**',
            dist: 'dist/**'
        },
        swigtemplates: {
            options: {
              defaultContext: data,
              templatesDir: 'src'
            },
            page: {
                dest: 'temp',
                src: ['src/**/*.html']
            },
        },
        babel: {
            main: {
                options: {
                    sourceMap: !isProd,
                    presets: ['@babel/preset-env']
                },
                files: {
                    'temp/assets/scripts/main.js':'src/assets/scripts/*.js'
                }
            }
        },
        eslint: {
            target: ['src/assets/scripts/*.js']
        },
        sass: {
            options: {
                implementation: {
                    sass
                },
                sourceMap: !isProd
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'src/assets/styles',
                    src: ['*.scss'],
                    dest: 'temp/assets/styles',
                    ext: '.css'
                }]
            }
        },
        browserSync: {
            dev: {
                bsFiles: {
                    src : [
                        'temp/assets/styles/*.css',
                        'temp/assets/scripts/*.js',
                        'temp/**/*.html',
                    ]
                },
                options: {
                    watchTask: true,
                    notify: false,
                    port: 3003,
                    server: {
                        baseDir: ['temp', 'src', 'public'],
                        routes: {
                            '/node_modules': 'node_modules'
                        }
                    }
                }
            },
            prod: {
                options: {
                    notify: false,
                    port: 3004,
                    server: {
                        baseDir: ['dist'],
                    }
                }
            }
        },
        useref: {
            html: 'temp/**/*.html',
            temp: 'temp',
        },
        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        cwd: 'public',
                        src: ['**'],
                        dest: 'dist'
                    },
                ],
            },
            mins: {
                files: [
                    {
                        expand: true,
                        cwd: 'temp/assets/',
                        src: [
                            'styles/**',
                            'scripts/**',
                        ],
                        dest: 'dist/assets/'
                    },
                ],
            },
        },
        htmlmin: {
            options: {
                removeComments: true, 
                removeCommentsFromCDATA: true,
                collapseWhitespace: true,
                collapseBooleanAttributes: true,
                removeAttributeQuotes: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeOptionalTags: true
            },
            main: {
                expand: true,
                cwd: './temp/',
                src: ['**/*.html'],
                dest: 'dist/'
            }
        },
        imagemin: {
            images: {
                options: {
                    optimizationLevel: 1 
                },
                files: [{
                    expand: true,
                    cwd: 'src/assets/images/',   
                    src: ['**'], 
                    dest: 'dist/assets/images/' 
                }]
            },
            fonts: {
                options: {
                    optimizationLevel: 1 
                },
                files: [{
                    expand: true,
                    cwd: 'src/assets/fonts/',   
                    src: ['**'], 
                    dest: 'dist/assets/fonts' 
                }]
            }
        },
        watch: {
            js: {
                files: ['src/assets/scripts/*.js'],
                tasks: ['lint', 'babel']
            },
            css: {
                files: ['src/assets/styles/*.scss'],
                tasks: ['sass']
            },
            html: {
                files: ['src/**/*.html'],
                tasks: ['swigtemplates']
            }
        }
    })

    grunt.registerTask('script', ['eslint', 'babel']);
    grunt.registerTask('style', ['sass'])
    grunt.registerTask('page', ['swigtemplates'])
    grunt.registerTask('compile', ['script', 'style', 'page']);
    grunt.registerTask('extra', ['copy']);

    grunt.registerTask('serve', [
        'clean',
        'compile',
        'browserSync:dev',
        'watch',
    ]);

    grunt.registerTask('build', [
        'clean',
        'compile',
        'useref',
        'concat',
        'uglify',
        'cssmin',
        'htmlmin',
        'imagemin',
        'extra'
    ]);
    grunt.registerTask('start', ['build', 'browserSync:prod'])
}