Rails.application.routes.draw do
  devise_for :users
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  namespace :api do
    namespace :v1 do
      mount_devise_token_auth_for 'User', at: 'auth', controllers: {
        registrations: 'api/v1/auth/registrations'
      }

      namespace :auth do
        resources :sessions, only: %i[ index ]
      end

      resources :lists

      # resources :projects, only: %i[ index show create destroy update ] do
      #   member do
      #     get "search"
      #   end
      # end

      # resources :sections, only: %i[ index create destroy update ]
      # resources :stories,  only: %i[ create destroy update ]
    end
  end
end
