Rails.application.routes.draw do
  root to: "pages#home"
  resources :imports do
    resources :records
    get 'search', on: :collection
  end
end
