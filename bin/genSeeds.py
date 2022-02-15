from operator import add
import pandas as pd
from faker import Faker
from pprint import pprint
from random import randint

fake = Faker()

def table_to_script(data,name):
  data = data[[i for i in data.columns if "temp" not in i]]
  entries = [f"({', '.join(row)})" for _,row in data.iterrows()]
  entries = ',\n'.join(entries)
  result = f"INSERT INTO {name} ({', '.join(data.columns)}) VALUES\n{entries};"
  return result

def add_quotes(item):
  return f"'{item}'"

users = pd.DataFrame()
for index in range(10):
  users.at[index,"name"] = add_quotes(fake.first_name())

maps = pd.DataFrame()
for index in range(50):
  location = fake.location_on_land()
  maps.at[index,"creator_id"] = str(randint(1,len(users)))
  maps.at[index,"date_created"] = add_quotes(f"{fake.past_date():%Y-%m-%d}")
  maps.at[index,"name"] = add_quotes(location[2])
  maps.at[index,"description"] = add_quotes((fake.paragraph(2)))
  maps.at[index,"temp_lat"] = location[0]
  maps.at[index,"temp_lng"] = location[1]

pins = pd.DataFrame()
for index in range(1000):
  map_index = randint(0,len(maps)-1)
  pins.at[index,"map_id"] = str(map_index + 1)
  pins.at[index,"title"] = add_quotes(fake.text(16)[:-1])
  pins.at[index,"description"] = add_quotes(fake.paragraph(2))
  pins.at[index,"image_url"] = add_quotes(fake.image_url())
  pins.at[index,"lat"] = str(fake.coordinate(maps.loc[map_index,"temp_lat"],0.02))
  pins.at[index,"lng"] = str(fake.coordinate(maps.loc[map_index,"temp_lng"],0.02))

favourites = pd.DataFrame()
for index in range(25):
  favourites.at[index,"user_id"] = str(randint(1,len(users)))
  favourites.at[index,"map_id"] = str(randint(1,len(maps)))
  favourites.at[index,"date_added"] = add_quotes(f"{fake.past_date():%Y-%m-%d}")

map_editors = pd.DataFrame()
for index in range(25):
  map_editors.at[index,"user_id"] = str(randint(1,len(users)))
  map_editors.at[index,"map_id"] = str(randint(1,len(maps)))

with open("db/seeds/01_users.sql","w") as file:
  file.seek(0)
  file.write(table_to_script(users,"users"))

with open("db/seeds/02_maps.sql","w") as file:
  file.seek(0)
  file.write(table_to_script(maps,"maps"))

with open("db/seeds/03_pins.sql","w") as file:
  file.seek(0)
  file.write(table_to_script(pins,"pins"))

with open("db/seeds/04_favourites.sql","w") as file:
  file.seek(0)
  file.write(table_to_script(favourites,"favourites"))

with open("db/seeds/05_map_editors.sql","w") as file:
  file.seek(0)
  file.write(table_to_script(map_editors,"map_editors"))

print("DONE")
