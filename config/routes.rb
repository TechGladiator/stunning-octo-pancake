Rails.application.routes.draw do
  root to: "pages#home"
  get '/imports/search', to: 'search#search'
  resources :imports do
    resources :records
  end
end
