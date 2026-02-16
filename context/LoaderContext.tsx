// context/LoaderContext.tsx
import React, { createContext, useState, ReactNode, useContext } from "react"
import { View, ActivityIndicator, Dimensions } from "react-native"


interface LoaderContextProps {
  showLoader: () => void
  hideLoader: () => void
  isLoading: boolean
}

export const LoaderContext = createContext<LoaderContextProps>({
  showLoader: () => { },
  hideLoader: () => { },
  isLoading: false
})

export const LoaderProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false)
  const screenHeight = Dimensions.get('screen').height;

  const showLoader = () => setIsLoading(true)
  const hideLoader = () => setIsLoading(false)

  return (
    <LoaderContext.Provider value={{ showLoader, hideLoader, isLoading }}>
      {children}

      {isLoading && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.7)', 
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            elevation: 10,
          }}
        >
          <ActivityIndicator size="large" color="#FF5A5F" />
        </View>
      )}


    </LoaderContext.Provider>
  )
}