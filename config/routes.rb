Rails.application.routes.draw do
  get 'stun/main'
  root to: "pages#home"
  resources :imports do
    resources :records
  end
end
