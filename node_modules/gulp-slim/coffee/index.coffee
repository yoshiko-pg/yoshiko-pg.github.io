{spawn} = require 'child_process'
through  = require 'through2'
gutil = require 'gulp-util'

PLUGIN_NAME = 'gulp-slim'

module.exports = (options = {}) ->

	# build a command with arguments
	cmnd = 'slimrb'
	args = []
	args.push '-s' # read input from standard input
	args.push '-p' if options.pretty
	args.push '-e' if options.erb
	args.push '-c' if options.compile
	args.push '-r' if options.rails
	args.push '-t' if options.translator 
	args.push '-l' if options.logicLess

	through.obj (file, encoding, callback) ->
		
		if file.isNull()
			@push file
			return callback()
		
		if file.isStream()
			@emit 'error', new gutil.PluginError PLUGIN_NAME, 'Streaming not supported'
			return callback()
		
		# relace the extension
		ext = if options.erb then '.erb' else '.html'
		file.path = gutil.replaceExtension file.path, ext
		
		program = spawn cmnd, args
		
		# create buffer
		b = new Buffer 0
		
		# add data to buffer
		program.stdout.on 'readable', =>
			while chunk = program.stdout.read()
				b = Buffer.concat [b, chunk], b.length + chunk.length
		
		# return data
		program.stdout.on 'end', =>
			file.contents = b
			@push file
			callback()
		
		# pass data to standard input
		program.stdin.write file.contents, =>
			program.stdin.end()
