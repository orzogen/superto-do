require 'sinatra'
require 'thin'
configure :production do
  require 'newrelic_rpm'
end

set :server, :thin

get '/' do
	send_file File.join(settings.public_folder, 'index.html')
end