Rails.application.routes.draw do
  root to: "pages#home"
  resources :imports do
    resources :records
  end
end
