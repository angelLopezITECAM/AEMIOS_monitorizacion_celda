backend = api
contenedor_backend = aemios_monitorizacion_celda-api

run:
	docker compose down
	docker compose up -d

restart:
	docker compose down -v --rmi all
	make run

restart_full:
	docker compose down -v --rmi all
	rm -rfv data/grafama-storage data/influxdb-storage
	make run

back:
	docker compose rm -svf $(backend)
	docker rmi $(contenedor_backend) 
	make run
