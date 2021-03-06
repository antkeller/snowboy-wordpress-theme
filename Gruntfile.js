module.exports = function (grunt) {
    // VARIABLES
    var headerScripts = [
        '_/js/lib/modernizr-2.7.2.js',
        '_/js/lib/MyFontsWebfontsKit.js'
    ];
    var footerScripts = [
        '_/js/lib/jquery-1.11.1.js',
        '_/js/lib/GSAP/TweenMax.js',
        '_/js/lib/GSAP/plugins/ScrollToPlugin.js',
        '_/js/lib/jquery.fitvids-1.1.0.js',
        '_/js/lib/jquery.unveil.js',
        '_/js/lib/lightbox.js',
        '_/js/lib/slick.js',
        '_/js/snowboy.main.js',
        '_/js/modules/*.js',
        '_/js/components/*.js'
    ];
    // PROJECT CONFIG
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        sass: {
            dev: {
                files: {
                    '_/compiled/snowboy.main.css': '_/css/snowboy.main.scss'
                },
                options: {
                    style: 'expanded',
                    sourcemap: 'auto',
                    trace: true,
                    debugInfo: true,
                    lineNumbers: true,
                    update: true
                }
            },
            prod: {
                files: {
                    '_/css/snowboy.main.css': '_/css/snowboy.main.scss'
                },
                options: {
                    style: 'compact',
                    sourcemap: 'none',
                    trace: false,
                    debugInfo: false,
                    lineNumbers: false
                }
            }
        },
        concat: {
            prod: {
                files: {
                    '_/js/snowboy.header.min.js': headerScripts,
                    '_/js/snowboy.footer.min.js': footerScripts
                }
            },
        },
        cssmin: {
            prod: {
                options: {
                    banner: '/*! <%= pkg.name %> v<%= pkg.version %> | (c) <%= grunt.template.today("yyyy") %> Snowboy Productions | snowboyproductions.us */\n'
                },
                files: {
                    '_/css/snowboy.main.min.css': ['_/css/snowboy.main.css']
                }
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> v<%= pkg.version %> | (c) <%= grunt.template.today("yyyy") %> Snowboy Productions | snowboyproductions.us */\n'
            },
            prod: {
                files: {
                    '_/js/snowboy.header.min.js': ['_/js/snowboy.header.min.js'],
                    '_/js/snowboy.footer.min.js': ['_/js/snowboy.footer.min.js']
                }
            }
        },
        watch: {
            markup: {
                files: ['*.php', 'page-templates/*.php', '_/inc/**/*.php'],
                options: {
                    livereload: true,
                }
            },
            js: {
                files: ['_/js/*.js', '_/js/**/*.js'],
                options: {
                    livereload: true
                }
            },
            sass: {
                files: ['_/css/*.scss', '_/css/**/*.scss'],
                tasks: ['sass:dev'],
                options: {
                    livereload: true
                }
            }
        }
    });
    // NPM TASKS
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    // GRUNT TASKS
    grunt.registerTask('run', ['sass:dev', 'scriptblock']); // default
    grunt.registerTask('build', ['sass:prod', 'concat', 'cssmin', 'uglify', 'scriptblock']);
    // Automate creation of scriptblock to be loaded in footer
    grunt.registerTask('scriptblock', function(){
        var scriptVersion, scriptHeader, scriptFooter, headerfiles, footerfiles;
        // write script version, same as project version
        scriptVersion = "<?php $GLOBALS['SCRIPT_VERSION'] = '" + grunt.file.readJSON('package.json').version + "'; ?>";
        grunt.file.write('_/inc/script-version.php', scriptVersion);
        scriptHeader = scriptFooter = '<?php // AUTO-GENERATED BY GRUNT. To change this block edit Gruntfile.js, not this file! ?>\n';
        // generate header script includes
        headerScripts.forEach(function(path) {
            headerfiles = grunt.file.expand(path);
            headerfiles.forEach(function(file){
                scriptHeader += '\t<script type="text/javascript" src="<?php echo get_template_directory_uri(); ?>/' + file + '"></script>\n';
            });
            grunt.file.write('_/inc/header-scripts.php', scriptHeader);
        });
        // generate footer script includes
        footerScripts.forEach(function(path) {
            footerfiles = grunt.file.expand(path);
            footerfiles.forEach(function(file){
                scriptFooter += '\t<script type="text/javascript" src="<?php echo get_template_directory_uri(); ?>/' + file + '"></script>\n';
            });
            grunt.file.write('_/inc/footer-scripts.php', scriptFooter);
        });
    });
};
