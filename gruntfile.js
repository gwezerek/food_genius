module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		
		pkg: grunt.file.readJSON('package.json'),
		
		// CONFIG ===================================/

		compass: {
			dist: {
				options: {              
					sassDir: ['sass'],
					cssDir: ['css']
				}
			}
		},
		watch: {
		    compass: {
			    files: ['**/*.{scss,sass}'],
			    tasks: ['compass']
		    }
		}

	});

	// DEPENDENT PLUGINS =========================/

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-compass');

	// TASKS =====================================/

	grunt.registerTask('default', ['compass','watch']);

};