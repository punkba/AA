exploreDf <- function(df_full, dv) {

data<-df_full

#consider target variable name given as input in HybridFS function as DV'
n <- dv

if(length(unique(data[[n]]))!=2)
{
  stop("Error: Dependent variables should be 2 for binary classification!")
}

names(data)[names(data)==n] <- "DV"
df_temp<-data

write.csv(df_temp,"C:/opencpuapp_ip/prepro_step1.csv")

#get the list of categorical variables
cat_var=data.frame()

df_temp<-df_temp[, names(df_temp) != n] 

#get the list of character variables
char <- df_temp[sapply(df_temp,is.character)]
cat_var<-char

#get the list of logical variables 
logcl <- df_temp[sapply(df_temp, is.logical)]
cat_var<-cbind(cat_var,logcl)

#get the list of Factors
#fact <- df_temp[sapply(df_temp, is.factor)]
#cat_var<-cbind(cat_var,fact)

#removing the categorical variables in df_temp 
df_temp<-df_temp[, !sapply(df_temp,is.logical)]
df_temp<-df_temp[, !sapply(df_temp,is.character)]

#determining other categorical variables with less than 52 levels
unique_lvl_cnt<-df_temp[lengths(lapply(df_temp, unique))<=52]
disc_var_names<-list()
disc_var_names<-names(unique_lvl_cnt)
discrete <- list(discrete=I(disc_var_names))
#get user input here and modify cat_var
user_input = list("a","b")
cat_var<-cbind(cat_var,user_input)

cat_var_names<-list()
cat_var_names<-names(cat_var)

#display the list of categorical variables
cat_var_names
categorical <- list(categorical=I(cat_var_names))

df_cont <- data[, names(data) != "DV"]
for(i in names(cat_var))
{
  df_cont<-df_cont[, names(df_cont) != i] 
}
cont_var_names<-list()
cont_var_names<-names(df_cont)

#display the list of continuous variables
cont_var_names
continuous <- list(continuous=I(cont_var_names))


#store the variables as list of lists
final_list <- list(discrete,categorical,continuous)

lapply(final_list, function(x) write.table( data.frame(x), 'test_user.csv'  , append= T, sep=','))

return(final_list)
#close loop and return lists
}