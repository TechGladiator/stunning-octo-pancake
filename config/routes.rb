Rails.application.routes.draw do
  root to: "pages#home"
  resources :imports do
    resources :records
    get 'search', on: :collection
    get '/sortASC/records', to: "records#sortASC"
    get '/sortDESC/records', to: "records#sortDESC"
  end
end
