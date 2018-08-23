Rails.application.routes.draw do
  root to: "stun#main"
  resources :imports do
    resources :records
  end
end
