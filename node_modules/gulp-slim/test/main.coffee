should = require 'should'
slim = require '../'
gutil = require 'gulp-util'
fs = require 'fs' 
path = require 'path'

createFile = (slimFileName, contents) ->
  base = path.join __dirname, 'fixtures'
  filePath = path.join base, slimFileName

  new gutil.File
    cwd: __dirname
    base: base
    path: filePath
    contents: contents || fs.readFileSync filePath

describe 'gulp-slim', () ->
  describe 'slim()', () ->
    it 'should pass file when it isNull()', (done) ->
      stream = slim()
      emptyFile =
        isNull: () -> true
      stream.on 'data', (data) ->
        data.should.equal emptyFile
        done()
      stream.write emptyFile
    
    it 'should emit error when file isStream()', (done) ->
      stream = slim()
      streamFile =
        isNull: () -> false
        isStream: () -> true
      stream.on 'error', (err) ->
        err.message.should.equal 'Streaming not supported'
        done()
      stream.write streamFile
    
    it 'should compile single slim file', (done) ->
      slimFile = createFile 'test.slim'
    
      stream = slim()
      stream.on 'data', (htmlFile) ->
        should.exist htmlFile
        should.exist htmlFile.path
        should.exist htmlFile.relative
        should.exist htmlFile.contents
        htmlFile.path.should.equal path.join __dirname, 'fixtures', 'test.html'
        String(htmlFile.contents).should.equal fs.readFileSync path.join(__dirname, 'expect/test.html'), 'utf8'
        done()
      stream.write slimFile
    
    it 'should compile single slim file with pretty option', (done) ->
      slimFile = createFile 'test.slim'
    
      stream = slim pretty:true
      stream.on 'data', (htmlFile) ->
        should.exist htmlFile
        should.exist htmlFile.path
        should.exist htmlFile.relative
        should.exist htmlFile.contents
        htmlFile.path.should.equal path.join __dirname, 'fixtures', 'test.html'
        String(htmlFile.contents).should.equal fs.readFileSync path.join(__dirname, 'expect/test-pretty.html'), 'utf8'
        done()
      stream.write slimFile