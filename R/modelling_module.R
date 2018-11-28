modelling_module<-function(DV,model_selection,predictorClass)
{
  library(pROC)
  library(caret)
  
  clearWarnings <- function(){
    assign("last.warning", NULL, envir = baseenv())
  }
  
  returnUniqueWarnings <- function(){
    wars <- warnings()[!duplicated(warnings())]
    
    if (length(wars) >= 8)
    {
      wars <- wars[1:8]
    }
    
   return(as.list(wars)) 
  }
  
  processModelOutput <- function(model,modelName){
    
    if(modelName == 'lr')
    {
      modelOutput <- as.data.frame(summary(model)$coefficients,keep.rownames = T)
      modelOutput$vars <- rownames(modelOutput)
      rownames(modelOutput) <- NULL
      modelOutput$pval <-  modelOutput[,4]
      modelOutput <- modelOutput[modelOutput$pval < 0.1,]
      modelOutput$`Std. Error` <- NULL
      modelOutput$`z value`<- NULL
      modelOutput$`Pr(>|z|)`<-NULL
      modelOutput$pval <- NULL
      
      #sink(file="C:/OpencpuApp_IP/lr_summary.txt",split=TRUE)
      sumMod <- summary(model)
      capture.output(sumMod,file="lr_summary.txt")
      
      print(summary(model))
      sink(NULL)
    }
    
    return(modelOutput)
  }
  
  processOutput <- function(model,vars,metrics,oemInd){
    library(dplyr)
    library(RJSONIO)
    library(data.table)
    
    if(oemInd)
    {
      selectedModel <- which.max(metrics$accuracy)
      
      variables <- vars[selectedModel]
      
      modResults <- metrics %>% select('tpr','fpr','tnr','fnr','accuracy')
      colnames(modResults) <- NULL
      metricOutput <- list()
      
      for(each in 1:nrow(modResults))
      {
        output <- list(as.numeric(metrics[each,'tpr']),
                       as.numeric(metrics[each,'fpr']),
                       as.numeric(metrics[each,'tnr']),
                       as.numeric(metrics[each,'fnr']),
                       as.numeric(metrics[each,'accuracy']))
        
        metricOutput[[each]] <- output
      }
      
      graph <- graph[selectedModel]
      save(graph,file="C:/OpencpuApp_IP/graph.RData")
    }
    else
    {
      modelName <- rownames(metrics)
      modelSaveLocation <- paste0(modelName,"_model.RData")
      
      save(model,file=modelSaveLocation)
      
      modelName <- list(modelName=I(modelName))
      modelSaveLocation <- list(modelSaveLocation=I(modelSaveLocation))
      
      modelCoeff <- processModelOutput(model,modelName)
  
      modelCoeff <-list(modelCoeff=I(modelCoeff))
      
      variables <- list(variables=I(vars))
      
      metricOutput <- list(as.numeric(metrics['tpr']),
                           as.numeric(metrics['fpr']),
                           as.numeric(metrics['tnr']),
                           as.numeric(metrics['fnr']),
                           as.numeric(metrics['accuracy']))
      
      metricOutput <- list(metricOutput=I(metricOutput))
      
      summaryPath <- list(summaryPath=I("lr_summary.txt"))
      
    }
    outL <- list(modelName,
                 modelSaveLocation,
                 modelCoeff,variables,metricOutput,summaryPath)
    
    #if(modelName == 'lr')
    #{
     # out <- jsonlite::toJSON(outL,pretty=T,auto_unbox = T)
      #out <- gsub(pattern = '\\]$', replacement = "}", x = out)
      #out <- gsub(pattern = '^\\[', replacement = "{", x = out)
    return (outL)
    #}
    #else
    #{
     # return (list(modelName,modelSaveLocation,modelCoeff,variables,metricOutput)) 
    #}
  }
  
  setUpFunction<- function(train,test,positive_class,model){
    
    if(is.numeric(train$DV))
    {
      if(model=="SVM")
      {
        train$DV <- as.factor(train$DV)
        test$DV <- as.factor(test$DV)
        
        levels(train$DV) <- c('No','Yes')
        levels(test$DV) <- c('No','Yes')
        positive_class <- "Yes"
      }
      else
      {
        if(!max(unique(train$DV)) == 1)
        {
          custlevels <- unique(train$DV)
          
          if(positive_class == 1)
          {
            train$DV[train$DV == positive_class] <- 1
            train$DV[train$DV != positive_class ] <- 0
            
            test$DV[test$DV == positive_class] <- 1
            test$DV[test$DV != positive_class ] <- 0
          }
          else
          {
            train$DV[train$DV == min(custlevels)] <- 0
            train$DV[train$DV == max(custlevels)] <- 1
            
            test$DV[test$DV == min(custlevels)] <- 0
            test$DV[test$DV == max(custlevels)] <- 1
            
            positive_class <- 1
          }
        }
      }
    }
    else
    {
      uniqLvls <- trimws(as.character(unique(test$DV)))
      negClass <- uniqLvls[uniqLvls != positive_class]
      
      train$DV <- trimws(as.character(train$DV))
      test$DV <- trimws(as.character(test$DV))
      
      if(model=='SVM')
      {
        positChangedClass <- make.names(positive_class)
        negChangedClass <- make.names(negClass)
        
        train$DV[train$DV == positive_class] <- positChangedClass
        train$DV[train$DV == negClass] <- negChangedClass
        train$DV <- as.factor(train$DV)
        
        
        test$DV[test$DV == positive_class] <- positChangedClass
        test$DV[test$DV == negClass] <- negChangedClass
        test$DV <- as.factor(test$DV)
        
        positive_class <- positChangedClass
        
      }
      else
      {
        
        train$DV[train$DV == positive_class] <- 1
        train$DV[train$DV == negClass] <- 0
        
        
        test$DV[test$DV == positive_class] <- 1
        test$DV[test$DV == negClass] <- 0
        
        train$DV <- as.numeric(train$DV)
        test$DV <- as.numeric(test$DV)
        
        positive_class <- 1
      }
    }
    
    return(list(train,test,positive_class))
  }
  
  evaluatemeasures <- function(testData){
    
    pred_f <- testData$Prob
    DV <- testData$DV
    predicted_val <- testData$predicted
    
    library(EvaluationMeasures)
    library(pROC)
    library(dplyr)
    library(plotly)
    
    if(!is.numeric(DV))
    {
      predicted_val <- as.character(predicted_val)
      DV <- as.character(DV)
      
      flagPred <- predicted_val == positive_class
      dvPred <- DV == positive_class
      
      predicted_val <- as.numeric(flagPred)
      DV <- as.numeric(dvPred)
    }
    
    tpr<-EvaluationMeasures.TPR(Real = DV,Predicted = predicted_val, Positive = 1)
    fpr<-EvaluationMeasures.FPR(Real = DV,Predicted = predicted_val, Positive = 1)
    tnr<-EvaluationMeasures.TNR(Real = DV,Predicted = predicted_val, Positive = 1)
    fnr<-EvaluationMeasures.FNR(Real = DV,Predicted = predicted_val, Positive = 1)
    recall<-EvaluationMeasures.Recall(Real = DV,Predicted = predicted_val, Positive = 1)
    precision<-EvaluationMeasures.Precision(Real = DV,Predicted = predicted_val, Positive = 1)
    f1score<-EvaluationMeasures.F1Score(Real = DV,Predicted = predicted_val, Positive = 1)
    Accuracy<-EvaluationMeasures.Accuracy(Real = DV,Predicted = predicted_val, Positive = 1)
    res = roc(as.numeric(DV), pred_f)
    plot_res <- plot(res) 
    
    testCopy <- testData
    testCopy$DV <- DV
    testCopy$predicted <- predicted_val
    
    #hitMiss <- hitvcap(testCopy)
    
    return(c(tpr,fpr,tnr,fnr,recall,precision,f1score,Accuracy,plot_res))
  }
  
  #hitvcap <- function(data){
    
  #  dataset_test_1 <- data
    
  #  Func <- function(cutoff, datas){
      
      
      ################# Predictions based on cutoff
  #   for ( i in 1:nrow(dataset_test_1)){
        
  #      if(dataset_test_1$Prob[i]>=cutoff){
  #        dataset_test_1$Pred[i] = 1
  #      } else{
  #        dataset_test_1$Pred[i]=0
  #      }
  #    }
      
      ################### Correct one's predicted  
  #    for ( i in 1:nrow(dataset_test_1)){
  #      if(dataset_test_1$Pred[i]+dataset_test_1$DV[i]==2){
  #        dataset_test_1$Pred1_crct[i] = 1
  #      } else{
  #        dataset_test_1$Pred1_crct[i]=0
  #      }
  #    }
      
      ################## Zero's Falsely Predicted
  #    temp <- subset(dataset_test_1,dataset_test_1$DV==1)
  #    for ( i in 1:nrow(temp)){
        
  #      if(temp$DV+temp$Pred[i]==1){
  #        temp$Pred1_false[i] = 1
  #      } else{
  #        temp$Pred1_false[i]=0
  #      }
  #    }
  #    df <- dataset_test_1
  #    tot_ones <- sum(df$DV == 1)
  #    tot_zeros <- length(df$DV==0)
  #    tot_ones_pred <- length(df$Pred == 1)
  #    hits <- sum(df$Pred1_crct == 1)/tot_ones
  #    miss <- sum(temp$Pred1_false == 1)/tot_ones
  #      ret <- matrix(c(hits, miss), nrow = 1)
  #   colnames(ret) <- c("Hits", "Miss")
  #   
  #   return(ret)
  # }
    
    
  # vec <- seq(0,1,0.1)
  # hit.df <- data.frame()
    
  # for(i in vec){
  #   hit.df <- rbind(hit.df, Func(i, dataset_test))
  # }
    
    
    
  # labels <- data.frame(x = hit.df$Miss, 
  #                      y = hit.df$Hits,
  #                     Threshold = vec)
    
# hit.df$Hits <- round(hit.df$Hits,2)
#   hit.df$Miss <- round(hit.df$Miss,2)
    
#   hit.df$Threshold=labels$Threshold
    
#   hitMissRt <- ggplot(data = hit.df,aes(x = Threshold,y = Hits)) +
#     geom_point() +
#     geom_line(aes(color="darkblue")) +
#    labs(x="Threshold",
#          y="Hit Rate/Miss Rate",
#          title = "Hit Rate/Miss Rate") +
#     geom_point(mapping=aes(x = Threshold,y = Miss)) +
#     geom_line(aes(color="orange")) +
#     scale_color_discrete(labels=c("Capture Rate","Hit Rate")) +
#     coord_cartesian(xlim=c(0,1),ylim = c(0,1)) +
#     theme(panel.grid.major = element_blank(), 
#           panel.grid.minor = element_blank(),
#           panel.background = element_rect(fill = "lightblue"))
    
    #hitMissRt <- plot_ly(hit.df, 
    #                    y = ~Hits, 
    #                   x = ~Threshold,
    #                     name='Hit Rate',
    #                     type='scatter',
    #                     mode='lines') %>%
    #  add_trace(y = ~Miss,
    #          name='Capture Rate',
    #          mode='lines') %>%
    #
    #  layout(xaxis = list(range = c(0,1), 
    #                      zeroline = F, 
    #                      showgrid = F,
    #                      title = "Threshold"),
    #         yaxis = list(range = c(0,1), 
    #                      zeroline = F, 
    #                      showgrid = F,
    #                      domain = c(0, 0.9),
    #                      title = "Hit Rate/Miss Rate"),
    #         plot_bgcolor = "aliceblue",title="Hit Rate vs Capture Rate"
    #  )
    #  return (hitMissRt)
    #}
  
  k_stat_value<- function(fullmodel,train,test,pos,model){
    
    train_KStat <- train
    if(! (model %in% c('SVM','NB')))
    {
      
      train_KStat$pred <- predict(fullmodel, 
                                  newdata = train,
                                  type = 'response') 
    }
    else if(model == "NB")
    {
      train_KStat$pred <- predict(fullmodel, 
                                  newdata = train,
                                  type = 'raw')[,pos]
    }
    else
    {
      train_KStat$pred <- predict(fullmodel, 
                                  newdata = train,
                                  type = 'prob')[,pos]
      
      levels(train_KStat$DV) <- c(1,0)
    }
    
    library(SDMTools)
    optimum_threshold = optim.thresh(train_KStat$DV, train_KStat$pred)
    thresh = optimum_threshold$`max.sensitivity+specificity`
    
    return(thresh)
  }
  
  variable_importance <- function(var_imp_mod,flag_svm){
    library(party)
    library(caret)
    
    if(flag_svm == "not_app"){
      return()
    }
    else {
      
      
      
      var_imp_res <-data.frame(var_names = character(),
                               Overall = double())
      mod_imp <- varImp(var_imp_mod,numTrees = 3000)
      
      if(flag_svm != "y")
      {
        names <- rownames(mod_imp)
        OverallScore <-mod_imp$Overall  
      }
      else
      {
        names <- rownames(mod_imp$importance)
        OverallScore <- mod_imp$importance[,positive_class]
      }
      
      combinedList <- list(var_names=names,Overall=OverallScore)
      var_imp_res <- rbind(var_imp_res,combinedList)
      mod_imp <- var_imp_res[order(var_imp_res$Overall,decreasing = TRUE),]
      return(mod_imp)
    }
  }
  
  GBM_func <- function(train,test,flagInp,positive_class){
    
    train_gbm<-train
    test_gbm<-test
    
    print("running GBM")
    
    library(gbm)
    gbm_model = gbm(DV~.+0, 
                    data=train_gbm, 
                    shrinkage=0.01, 
                    distribution = 'bernoulli', 
                    cv.folds=5, 
                    n.trees=3000, 
                    verbose=F)
    
    predResult <- predFunction(gbm_model,train_gbm,test_gbm,positive_class,"GBM")
    
    test_gbm <- predResult
    
    best.iter = gbm.perf(gbm_model, method="cv")
    
    evalResults<- evaluatemeasures(test_gbm)
    
    model_evaluations["gbm",] <- evalResults
    
    
    important_variables<- variable_importance(gbm_model,"n")
    
    model_evaluations <- model_evaluations[rowSums(is.na(model_evaluations)) != ncol(model_evaluations),]
    
    if(flagInp)
    {
      return (list(as.character(important_variables$var_names),
                   model_evaluations,evalResults[[2]]))  
    }
    else
    {
      return (processOutput(gbm_model,
                            important_variables,
                            model_evaluations,
                            flagInp))
    }
  }
  
  LR_func <- function(train,test,flagInp,positive_class){
    
    print("running LR")
    
    train_lr<-train
    test_lr<-test
    
    lr_model <- glm (DV ~ ., 
                     data =train_lr, 
                     family = binomial)
    
    predResult <- predFunction(lr_model,train_lr,test_lr,positive_class,"LR")
    
    test_lr <- predResult
    
    evalResults<- evaluatemeasures(test_lr)
    
    model_evaluations["lr",] <- evalResults
    
    important_variables <- variable_importance(lr_model,"n")
    
    model_evaluations <- model_evaluations[rowSums(is.na(model_evaluations)) != ncol(model_evaluations),]
    
    if(flagInp)
    {
      return (list(as.character(important_variables$var_names),
                   model_evaluations,evalResults[[2]]))  
    }
    else
    {
      return (processOutput(lr_model,
                            important_variables,
                            model_evaluations,
                            flagInp))
    }
    
  }
  
  RF_func <- function(train,test,flagInp,positive_class){
    print("running RF")
    train_rf <-train
    test_rf <- test

    library(randomForest)
    library(ROSE)
    
    treeimp <- randomForest(DV ~ ., 
                            data = train_rf, 
                            ntrees=100,
                            importance=T)
    #Identifying threshold
    
    predResult <- predFunction(treeimp,train_rf,test_rf,positive_class,"RF")
    
    test_rf <- predResult
    
    roc.curve(test_rf$DV, test_rf$Prob, plotit = F)
    important_variables <- variable_importance(treeimp,"n")
    
    evalResults<- evaluatemeasures(test_rf)
    
    model_evaluations["rf",] <- evalResults
    
    model_evaluations <- model_evaluations[rowSums(is.na(model_evaluations)) != ncol(model_evaluations),]
    
    if(flagInp)
    {
      return (list(as.character(important_variables$var_names),
                   model_evaluations,evalResults[[2]]))  
    }
    else
    {
      return (processOutput(treeimp,
                            important_variables,
                            model_evaluations,
                            flagInp))
    }
  }
  
  NB_func<- function(train,test,flagInp,positive_class){
    
    print("running NB")
    train_nb<-train
    test_nb<-test
 
    library(e1071)
    Naive_Bayes_Model <- naiveBayes(as.factor(train_nb$DV) ~., 
                                    data=train_nb)
    
    summary(Naive_Bayes_Model)
    
    predResult <- predFunction(Naive_Bayes_Model,train_nb,test_nb,positive_class,"NB")
    
    test_nb <- predResult
    
    evalResults<- evaluatemeasures(test_nb)
    
    model_evaluations["nb",] <- evalResults
    
    important_variables  <- variable_importance(Naive_Bayes_Model,"not_app")
    
    model_evaluations <- model_evaluations[rowSums(is.na(model_evaluations)) != ncol(model_evaluations),]
    
    if(flagInp)
    {
      return (list(as.character(important_variables$var_names),
                   model_evaluations,evalResults[[2]]))  
    }
    else
    {
      return (processOutput(Naive_Bayes_Model,
                            important_variables,
                            model_evaluations,
                            flagInp))
    }
  }
  
  SVM_func <- function(test,train,flagInp,positive_class){
    print("running SVM")
    train_svm<- train
    test_svm<- test
    
    library(caret)
    
    trctrl <- trainControl(method = "cv", 
                           number =5,
                           classProbs = TRUE,
                           savePredictions = 'final')
    
    set.seed(323)
    
    svm_radial <- train(DV ~., 
                        data = train_svm, 
                        method = "svmRadial",
                        trControl=trctrl)
    
    predResult <- predFunction(svm_radial,train_svm,test_svm,positive_class,"SVM")
    
    test_svm <- predResult
    
    evalResults<- evaluatemeasures(test_svm)
    
    model_evaluations["svm",] <- evalResults
    
    important_variables  <- variable_importance(svm_radial,"y")
    
    model_evaluations <- model_evaluations[rowSums(is.na(model_evaluations)) != ncol(model_evaluations),]
    
    if(flagInp)
    {
      return (list(as.character(important_variables$var_names),
                   model_evaluations,evalResults[[2]]))  
    }
    else
    {
      return (processOutput(svm_radial,
                            important_variables,
                            model_evaluations,
                            flagInp))
    }
  }
  
  OEM_func<-function(train,test,flagInp,positive_class){
    train_oem <- train
    test_oem <- test
    oem_results <- data.frame()
    oem_vars <- list()
    oem_graph <- list()
    
    flag <- T
    
    lr_results <- LR_func(train_oem,test_oem,flag,positive_class)
    nb_results <- NB_func(train_oem,test_oem,flag,positive_class)
    rf_results <- RF_func(train_oem,test_oem,flag,positive_class)
    
    oem_results <- rbind(lr_results[2][[1]],
                         rf_results[2][[1]],
                         nb_results[2][[1]])
    
    oem_vars <- list(list(lr_results[[1]]),
                     list(rf_results[[1]]),
                     list(nb_results[[1]]))
    oem_graph <- list(lr_results[[3]],
                      rf_results[[3]],
                      nb_results[[3]])
    
    output<- processOutput(oem_vars,oem_results,oem_graph,flag)
    
    return (output)
  }
  
  predFunction <- function(modelInput,trainD,testD,posit_class,model){
    type <-""
    negClass <- ""
    if (model == "SVM")
    {
      typeResp <- 'prob'
    }
    else if(model == "NB"){
      typeResp <- 'raw'
    }
    else
    {
      typeResp <- 'response'
    }
    if(is.null(posit_class))
    {
      if(is.numeric(testD$DV))
      {
        posit_class <- 1 
      }
      else if(is.factor(testD$DV))
      {
        dvList <- tolower(unique(testD$DV))
        if("yes" %in% dvList)
        {
          posit_class <- "yes"
        }
        else
        {
          posit_class <- names(which.max(table(testD$DV)))
        }
      }
      positive_class <- posit_class
    }
    if(posit_class==1)
    {
      negClass <- 0
    }
    else
    {
      uniqLvls <- as.character(unique(testD$DV))
      negClass <- uniqLvls[uniqLvls != posit_class]
    }
    
    threshold<-k_stat_value(modelInput,trainD,testD,posit_class,model)
    
    if(! (model %in% c('SVM','NB')))
    {
      
      pred <- predict(modelInput, 
                      newdata=testD,
                      type = typeResp)  
    }
    else
    {
      pred <- predict(modelInput, 
                      newdata=testD,
                      type = typeResp)[,posit_class]
    }
    
    testD$Prob <- pred
    
    testD$predicted[pred>max(threshold)] <- posit_class
    testD$predicted[pred<=max(threshold)] <- negClass
    
    return(testD)
  }
  
  train<-read.csv("C:/opencpuapp_ip/train_comp.csv")	
  
  test<-read.csv("C:/opencpuapp_ip/test_comp.csv")
  
  drops <- c("X")
  train<-train[ , !(names(train) %in% drops)]
  test<-test[ , !(names(test) %in% drops)]	
  
  model_evaluations<-setNames(data.frame(matrix(ncol = 9, nrow = 9)), 
                              c("tpr","fpr","tnr","fnr","recall",
                                "precision","f1score","accuracy","roc")
                              )
  rownames(model_evaluations)<-c("lr","rf_rose","rf_over","rf_under",
                                 "rf_both","gbm","svm","nn","nb")
  
  names(train)[names(train)==DV] <- "DV"
  names(test)[names(test)==DV] <- "DV"
  
  ##The class that needs to be predicted when the prob > threshold
  positive_class <- as.numeric(predictorClass)
  model <- model_selection

  oemFlag <- F
  
  dataUpdated <- setUpFunction(train,test,positive_class,model)
  train <- dataUpdated[[1]]
  test <- dataUpdated[[2]]
  positive_class <- dataUpdated[[3]]
  
  rm(dataUpdated)
  
  #fn <- match.fun(paste(model,'func',sep='_'))
  fn <- get(paste(model,'func',sep='_'))
  vars_imp <- fn(train,test,oemFlag,positive_class)
  
  return (vars_imp)
}

