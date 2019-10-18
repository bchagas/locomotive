source 'https://rubygems.org'

ruby '1.9.3'

gem 'json'
gem 'locomotive_cms', '~> 2.0.0.rc9', :require => 'locomotive/engine'
gem 'locomotive-heroku', '~> 0.0.2', :require => 'locomotive/heroku'
gem 'rails', '3.2.17'
gem 'cloudinary'

group :assets do
  gem 'coffee-rails', '~> 3.2.1'
  gem 'compass-rails'
  gem 'sass-rails',   '~> 3.2.3'
  gem 'uglifier', '>= 1.0.3'
end

group :development do
  gem 'unicorn'
end

group :production do
  gem 'thin'
end
