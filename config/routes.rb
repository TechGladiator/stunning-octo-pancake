Rails.application.routes.draw do
  resources :imports do
    resources :records
  end
end
