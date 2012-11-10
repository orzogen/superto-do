require 'sinatra'
require 'thin'

set :server, :thin

get '/' do
	send_file File.join(settings.public_folder, 'index.html')
end